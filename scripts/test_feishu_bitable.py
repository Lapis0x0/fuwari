import os
import json
import requests
from datetime import datetime

# 飞书开放平台的配置
APP_ID = os.getenv('FEISHU_APP_ID')
APP_SECRET = os.getenv('FEISHU_APP_SECRET')
BITABLE_ID = os.getenv('FEISHU_BITABLE_ID')  # 多维表格 ID
TABLE_ID = os.getenv('FEISHU_TABLE_ID')      # 数据表 ID

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
        save_to_json(records)
    else:
        print("Failed to fetch records")

if __name__ == "__main__":
    main()
