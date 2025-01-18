import os
import json
import requests
import hashlib
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from PIL import Image
from io import BytesIO

# 飞书开放平台的配置
APP_ID = os.getenv('FEISHU_APP_ID')
APP_SECRET = os.getenv('FEISHU_APP_SECRET')
BITABLE_ID = os.getenv('FEISHU_BITABLE_ID')  # 多维表格 ID
TABLE_ID = os.getenv('FEISHU_TABLE_ID')      # 数据表 ID

# 图片压缩配置
MAX_SIZE = (800, 1200)  # 最大尺寸
WEBP_QUALITY = 85  # WebP质量（1-100）
MAX_FILE_SIZE = 300 * 1024  # 300KB（WebP通常可以更小）
WEBP_LOSSLESS = False  # 有损压缩
WEBP_METHOD = 4  # 压缩方法（0-6，6质量最好但最慢）

def compress_image(image_data):
    """压缩图片为WebP格式"""
    img = Image.open(BytesIO(image_data))
    
    # 转换为RGB模式（处理RGBA图片）
    if img.mode in ('RGBA', 'P'):
        if img.mode == 'P':
            img = img.convert('RGBA')
        # 检查是否有实际的透明通道
        if img.mode == 'RGBA':
            # 获取alpha通道
            alpha = img.split()[3]
            has_alpha = min(alpha.getextrema()) < 255
        else:
            has_alpha = False
    else:
        has_alpha = False
        img = img.convert('RGB')
    
    # 调整尺寸
    if img.size[0] > MAX_SIZE[0] or img.size[1] > MAX_SIZE[1]:
        img.thumbnail(MAX_SIZE, Image.LANCZOS)
    
    # 压缩图片
    output = BytesIO()
    quality = WEBP_QUALITY
    
    while True:
        output.seek(0)
        output.truncate()
        
        # 根据是否有透明通道选择压缩参数
        if has_alpha:
            img.save(output, 
                    format='WEBP',
                    quality=quality,
                    method=WEBP_METHOD,
                    lossless=WEBP_LOSSLESS,
                    exact=True)  # 保留完整alpha通道
        else:
            img.save(output, 
                    format='WEBP',
                    quality=quality,
                    method=WEBP_METHOD,
                    lossless=WEBP_LOSSLESS)
        
        # 如果文件够小或质量已经很低，就退出
        if output.tell() <= MAX_FILE_SIZE or quality <= 40:
            break
            
        # 否则降低质量继续尝试
        quality -= 5
    
    return output.getvalue()

def get_tenant_access_token():
    """获取飞书应用的 tenant_access_token"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "app_id": APP_ID,
        "app_secret": APP_SECRET
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json().get("tenant_access_token")

def get_bitable_records():
    """获取多维表格中的记录"""
    token = get_tenant_access_token()
    if not token:
        print("Failed to get access token")
        return None
    
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{BITABLE_ID}/tables/{TABLE_ID}/records"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

def download_image(url, token, save_dir):
    """下载图片并返回本地路径"""
    try:
        # 生成文件名（使用URL的哈希值）
        url_hash = hashlib.md5(url.encode()).hexdigest()
        filename = f"{url_hash}.webp"  # 使用webp格式
        local_path = os.path.join(save_dir, filename)
        
        # 如果文件已存在，直接返回路径
        if os.path.exists(local_path):
            print(f"Image already exists: {filename}")
            return os.path.join('/images/books', filename)
        
        # 下载图片
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # 压缩图片
        compressed_data = compress_image(response.content)
        
        # 保存压缩后的图片
        with open(local_path, 'wb') as f:
            f.write(compressed_data)
        
        original_size = len(response.content) / 1024  # KB
        compressed_size = len(compressed_data) / 1024  # KB
        compression_ratio = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0
        print(f"Downloaded: {filename} (Original: {original_size:.1f}KB, Compressed: {compressed_size:.1f}KB, Saved: {compression_ratio:.1f}%)")
        
        return os.path.join('/images/books', filename)
    except Exception as e:
        print(f"Error downloading image {url}: {str(e)}")
        return None

def process_records(records, token):
    """处理记录，下载图片并更新图片路径"""
    if not records or 'data' not in records or 'items' not in records['data']:
        return records
    
    # 确保图片目录存在
    save_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'images', 'books')
    os.makedirs(save_dir, exist_ok=True)
    
    # 处理每条记录
    for item in records['data']['items']:
        if '封面' in item['fields'] and item['fields']['封面']:
            covers = item['fields']['封面']
            new_covers = []
            for cover in covers:
                if 'url' in cover:
                    # 下载图片并获取本地路径
                    local_path = download_image(cover['url'], token, save_dir)
                    if local_path:
                        new_cover = cover.copy()
                        new_cover['local_path'] = local_path
                        new_covers.append(new_cover)
            if new_covers:
                item['fields']['封面'] = new_covers
    
    return records

def save_to_json(data):
    """将数据保存为 JSON 文件"""
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'data', 'books.json')
    
    # 添加更新时间
    data['last_updated'] = datetime.now().isoformat()
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Data saved to {output_path}")

def main():
    """主函数"""
    # 检查环境变量
    required_vars = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'FEISHU_BITABLE_ID', 'FEISHU_TABLE_ID']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these environment variables before running the script.")
        return
    
    print("Fetching records from Feishu Bitable...")
    records = get_bitable_records()
    
    if records:
        # 获取 token 用于下载图片
        token = get_tenant_access_token()
        if token:
            # 处理记录并下载图片
            records = process_records(records, token)
            save_to_json(records)
        else:
            print("Failed to get access token for downloading images")
    else:
        print("Failed to fetch records")

if __name__ == "__main__":
    main()
