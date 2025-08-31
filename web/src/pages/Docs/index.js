import React, { useContext, useEffect, useState } from 'react';
import { StatusContext } from '../../context/Status';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';

const Docs = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [docsLoaded, setDocsLoaded] = useState(false);

  const docsLink = statusState?.status?.docs_link || '';

  useEffect(() => {
    // 模拟加载状态，确保statusState已经加载完成
    if (statusState?.status !== undefined) {
      setDocsLoaded(true);
    }
  }, [statusState?.status]);

  const emptyStyle = {
    padding: '24px'
  };

  const customDescription = (
    <div style={{ textAlign: 'center' }}>
      <p>{t('管理员暂时未设置文档链接')}</p>
      <p>{t('可在设置页面配置文档链接地址')}</p>
    </div>
  );

  return (
    <div className="mt-[64px] px-2">
      {docsLoaded && !docsLink ? (
        <div className="flex justify-center items-center h-screen p-8">
          <Empty
            image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
            description={t('暂无文档内容')}
            style={emptyStyle}
          >
            {customDescription}
          </Empty>
        </div>
      ) : (
        docsLink && (
          <iframe
            src={docsLink}
            style={{ 
              width: '100%', 
              height: 'calc(100vh - 64px)', 
              border: 'none',
              backgroundColor: 'white'
            }}
            title={t('文档')}
            onError={(e) => {
              console.error('iframe加载失败:', e);
            }}
          />
        )
      )}
    </div>
  );
};

export default Docs;
