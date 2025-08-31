import React from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccess } from '../../helpers';

const Contact = () => {
  const { t } = useTranslation();

  // 配置联系信息
  const CONTACT_CONFIG = {
    telegram: '@bigaipro',
    email: 'service@bigaipro.com'
  };

  // 打开 Telegram
  const openTelegram = () => {
    const username = CONTACT_CONFIG.telegram.replace('@', '');
    window.open(`https://t.me/${username}`, '_blank');
  };

  // 发送邮件
  const sendEmail = () => {
    window.open(`mailto:${CONTACT_CONFIG.email}?subject=咨询服务&body=您好，我想咨询...`, '_blank');
  };

  // 复制到剪贴板
  const copyToClipboard = async (type) => {
    let text = '';
    switch (type) {
      case 'telegram':
        text = CONTACT_CONFIG.telegram;
        break;
      case 'email':
        text = CONTACT_CONFIG.email;
        break;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级到传统方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showSuccess(t('复制成功'));
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制：' + text);
    }
  };

  return (
    <div className="mt-[64px] min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {t('联系我们')}
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: '#718096',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          {t('我们致力于为您提供优质的服务，如果您有任何问题或建议，请随时与我们联系。')}<br />
          {t('我们会尽快回复您的消息。')}
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '30px',
          marginBottom: '40px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }} className="contact-grid">
          {/* Telegram 联系方式 */}
          <div 
            onClick={openTelegram}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="contact-card hover:transform hover:translate-y-[-8px] hover:scale-105 hover:shadow-2xl"
          >
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              background: 'linear-gradient(135deg, #0088cc, #0066aa)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.59c-.12.55-.44.68-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.47-4.03c.19-.17-.04-.27-.3-.1L8.82 12.7l-2.4-.75c-.52-.16-.53-.52.11-.78l9.38-3.61c.43-.16.81.1.67.78z"/>
              </svg>
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Telegram
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#4a5568',
              marginBottom: '20px',
              wordBreak: 'break-all'
            }}>
              {CONTACT_CONFIG.telegram}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openTelegram();
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              className="hover:transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              {t('立即联系')}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard('telegram');
              }}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              className="hover:bg-opacity-20"
            >
              {t('复制用户名')}
            </button>
          </div>
          
          {/* 邮件联系方式 */}
          <div 
            onClick={sendEmail}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="contact-card hover:transform hover:translate-y-[-8px] hover:scale-105 hover:shadow-2xl"
          >
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              background: 'linear-gradient(135deg, #ea4335, #d33b2c)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              {t('邮箱')}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#4a5568',
              marginBottom: '20px',
              wordBreak: 'break-all'
            }}>
              {CONTACT_CONFIG.email}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                sendEmail();
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              className="hover:transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              {t('发送邮件')}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard('email');
              }}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              className="hover:bg-opacity-20"
            >
              {t('复制邮箱')}
            </button>
          </div>
        </div>
        
        <div style={{
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(113, 128, 150, 0.2)',
          color: '#718096',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          <p><strong>{t('联系时间：')}</strong>{t('周一至周日 9:00-22:00')}</p>
          <p><strong>{t('响应时间：')}</strong>{t('我们通常在24小时内回复您的消息')}</p>
          <p>{t('感谢您选择我们的服务，期待与您的交流！')}</p>
        </div>
      </div>
      
      <style jsx>{`
        .contact-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            max-width: 400px !important;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .contact-card {
            background: rgba(74, 85, 104, 0.8) !important;
            border-color: rgba(113, 128, 150, 0.2) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
