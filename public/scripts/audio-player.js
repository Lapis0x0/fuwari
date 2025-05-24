/**
 * 音频播放器脚本
 * 自动处理带有data-audio-src属性的音频容器
 */
document.addEventListener('DOMContentLoaded', () => {
  // 查找所有带有data-audio-src属性的音频容器
  const audioContainers = document.querySelectorAll('.audio-player-container[data-audio-src]');
  
  audioContainers.forEach(container => {
    const audioSrc = container.getAttribute('data-audio-src');
    const audio = container.querySelector('audio');
    const downloadLink = container.querySelector('.audio-download');
    
    if (audioSrc && audio) {
      // 设置音频源
      audio.src = audioSrc;
      
      // 当音频元数据加载完成时
      audio.addEventListener('loadedmetadata', () => {
        // 可以在这里添加额外的处理逻辑
      });
      
      // 当音频加载出错时
      audio.addEventListener('error', () => {
        // 创建错误消息
        const errorMsg = document.createElement('div');
        errorMsg.className = 'audio-error-message';
        errorMsg.textContent = '音频加载失败，请尝试使用下载链接';
        
        // 如果已经有错误消息，则不重复添加
        if (!container.querySelector('.audio-error-message')) {
          container.insertBefore(errorMsg, audio.nextSibling);
        }
      });
    }
    
    if (audioSrc && downloadLink) {
      // 设置下载链接
      downloadLink.href = audioSrc;
      downloadLink.setAttribute('download', ''); // 确保有download属性
    }
  });
});
