import React, { useContext, useEffect, useState, useRef, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/User/index.js';
import { useSetTheme, useTheme } from '../../context/Theme/index.js';
import { useTranslation } from 'react-i18next';
import { API, getLogo, getSystemName, showSuccess, stringToColor } from '../../helpers/index.js';
import fireworks from 'react-fireworks';
import { CN, GB } from 'country-flag-icons/react/3x2';
import NoticeModal from './NoticeModal.js';

import {
  IconClose,
  IconMenu,
  IconLanguage,
  IconChevronDown,
  IconSun,
  IconMoon,
  IconExit,
  IconUserSetting,
  IconCreditCard,
  IconKey,
  IconBell,
} from '@douyinfe/semi-icons';
import {
  Avatar,
  Button,
  Dropdown,
  Tag,
  Typography,
  Skeleton,
  Badge,
} from '@douyinfe/semi-ui';
import { StatusContext } from '../../context/Status/index.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed.js';

// 样式常量
const STYLES = {
  // 基础动画
  transition: 'transition-all duration-300 ease-out',
  transitionFast: 'transition-all duration-200 ease-out',
  
  // 悬停效果
  hoverScale: 'hover:scale-105 active:scale-95',
  hoverGlow: 'hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20',
  
  // 背景渐变
  gradientBg: 'bg-gradient-to-r from-white/85 via-blue-50/80 to-white/85 dark:from-gray-900/85 dark:via-gray-800/80 dark:to-gray-900/85',
  
  // 毛玻璃效果
  glassMorphism: 'backdrop-blur-xl backdrop-saturate-150',
  
  // 按钮样式
  modernButton: 'relative overflow-hidden group',
  
  // 下拉菜单
  modernDropdown: 'backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/30 shadow-2xl',
};

// Logo组件
const ModernLogo = memo(({ logo, systemName, isLoading, onClick }) => {
  return (
    <Link 
      to="/" 
      onClick={onClick}
      className={`flex items-center gap-3 group ${STYLES.transition} ${STYLES.hoverScale}`}
    >
      <div className="relative">
        <Skeleton
          loading={isLoading}
          active
          placeholder={
            <Skeleton.Image
              active
              className="h-8 md:h-9 !rounded-full"
              style={{ width: 36, height: 36 }}
            />
          }
        >
          <div className="relative overflow-hidden rounded-full">
            <img 
              src={logo} 
              alt="logo" 
              className={`h-8 md:h-9 ${STYLES.transition} group-hover:rotate-[5deg] rounded-full ring-2 ring-transparent group-hover:ring-blue-500/30`}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Skeleton>
      </div>
      
      <div className="hidden md:flex items-center gap-2">
        <Skeleton
          loading={isLoading}
          active
          placeholder={
            <Skeleton.Title
              active
              style={{ width: 120, height: 28 }}
            />
          }
        >
          <Typography.Title 
            heading={4} 
            className="!text-xl !font-bold !mb-0 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300"
          >
            {systemName}
          </Typography.Title>
        </Skeleton>
      </div>
    </Link>
  );
});

// 导航链接组件
const NavigationLinks = memo(({ links, isLoading, isMobile, onLinkClick, userState }) => {
  if (isLoading) {
    const skeletonLinkClasses = isMobile
      ? 'flex items-center gap-2 p-4 w-full rounded-xl'
      : 'flex items-center gap-2 p-3 rounded-xl';
    return Array(4)
      .fill(null)
      .map((_, index) => (
        <div key={index} className={skeletonLinkClasses}>
          <Skeleton
            loading={true}
            active
            placeholder={
              <Skeleton.Title
                active
                style={{ width: isMobile ? 100 : 70, height: 16 }}
              />
            }
          />
        </div>
      ));
  }

  return links.map((link) => {
    const commonLinkClasses = isMobile
      ? `flex items-center gap-2 p-4 w-full text-gray-700 dark:text-gray-200 rounded-xl font-semibold ${STYLES.transition} hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-[1.02] hover:shadow-md`
      : `flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-xl font-semibold ${STYLES.transition} hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 ${STYLES.hoverScale} hover:shadow-md`;

    const linkContent = (
      <>
        <span className="relative z-10">{link.text}</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
      </>
    );

    if (link.isExternal) {
      return (
        <a
          key={link.itemKey}
          href={link.externalLink}
          target='_blank'
          rel='noopener noreferrer'
          className={`${commonLinkClasses} group relative`}
          onClick={() => onLinkClick(link.itemKey)}
        >
          {linkContent}
        </a>
      );
    }

    let targetPath = link.to;
    if (link.itemKey === 'console' && !userState?.user) {
      targetPath = '/login';
    }

    return (
      <Link
        key={link.itemKey}
        to={targetPath}
        className={`${commonLinkClasses} group relative`}
        onClick={() => onLinkClick(link.itemKey)}
      >
        {linkContent}
      </Link>
    );
  });
});



const HeaderBarModern = ({ onMobileMenuToggle, drawerOpen }) => {
  const { t, i18n } = useTranslation();
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const isMobile = useIsMobile();
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const loadingStartRef = useRef(Date.now());

  const systemName = getSystemName();
  const logo = getLogo();
  const currentDate = new Date();
  const isNewYear = currentDate.getMonth() === 0 && currentDate.getDate() === 1;

  const isSelfUseMode = statusState?.status?.self_use_mode_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;

  const isConsoleRoute = location.pathname.startsWith('/console');

  const theme = useTheme();
  const setTheme = useSetTheme();

  const announcements = statusState?.status?.announcements || [];

  const getAnnouncementKey = useCallback((a) => `${a?.publishDate || ''}-${(a?.content || '').slice(0, 30)}`, []);

  const calculateUnreadCount = useCallback(() => {
    if (!announcements.length) return 0;
    let readKeys = [];
    try {
      readKeys = JSON.parse(localStorage.getItem('notice_read_keys')) || [];
    } catch (_) {
      readKeys = [];
    }
    const readSet = new Set(readKeys);
    return announcements.filter((a) => !readSet.has(getAnnouncementKey(a))).length;
  }, [announcements, getAnnouncementKey]);

  const getUnreadKeys = useCallback(() => {
    if (!announcements.length) return [];
    let readKeys = [];
    try {
      readKeys = JSON.parse(localStorage.getItem('notice_read_keys')) || [];
    } catch (_) {
      readKeys = [];
    }
    const readSet = new Set(readKeys);
    return announcements.filter((a) => !readSet.has(getAnnouncementKey(a))).map(getAnnouncementKey);
  }, [announcements, getAnnouncementKey]);

  useEffect(() => {
    setUnreadCount(calculateUnreadCount());
  }, [calculateUnreadCount]);

  const mainNavLinks = [
    {
      text: t('首页'),
      itemKey: 'home',
      to: '/',
    },
    {
      text: t('控制台'),
      itemKey: 'console',
      to: '/console',
    },
    {
      text: t('定价'),
      itemKey: 'pricing',
      to: '/pricing',
    },
    ...(docsLink
      ? [
        {
          text: t('文档'),
          itemKey: 'docs',
          to: '/docs',
        },
      ]
      : []),
    {
      text: t('联系我们'),
      itemKey: 'contact',
      to: '/contact',
    },
    // {
    //   text: t('关于'),
    //   itemKey: 'about',
    //   to: '/about',
    // },
  ];

  const logout = useCallback(async () => {
    await API.get('/api/user/logout');
    showSuccess(t('注销成功!'));
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  }, [t, userDispatch, navigate]);

  const handleNewYearClick = useCallback(() => {
    fireworks.init('root', {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
    }, 3000);
  }, []);

  const handleNoticeOpen = useCallback(() => {
    setNoticeVisible(true);
  }, []);

  const handleNoticeClose = useCallback(() => {
    setNoticeVisible(false);
    if (announcements.length) {
      let readKeys = [];
      try {
        readKeys = JSON.parse(localStorage.getItem('notice_read_keys')) || [];
      } catch (_) {
        readKeys = [];
      }
      const mergedKeys = Array.from(new Set([...readKeys, ...announcements.map(getAnnouncementKey)]));
      localStorage.setItem('notice_read_keys', JSON.stringify(mergedKeys));
    }
    setUnreadCount(0);
  }, [announcements, getAnnouncementKey]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('theme-mode', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.removeAttribute('theme-mode');
      document.documentElement.classList.remove('dark');
    }

    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage({ themeMode: theme }, '*');
    }
  }, [theme]);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(lng);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({ lang: lng }, '*');
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (statusState?.status !== undefined) {
      const elapsed = Date.now() - loadingStartRef.current;
      const remaining = Math.max(0, 500 - elapsed);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [statusState?.status]);

  const handleLanguageChange = useCallback((lang) => {
    i18n.changeLanguage(lang);
    setMobileMenuOpen(false);
  }, [i18n]);

  const handleNavLinkClick = useCallback((itemKey) => {
    setMobileMenuOpen(false);
  }, []);

  const renderUserArea = useCallback(() => {
    if (isLoading) {
      return (
        <div className={`flex items-center p-2 rounded-xl bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 ${STYLES.transition}`}>
          <Skeleton
            loading={true}
            active
            placeholder={<Skeleton.Avatar active size="extra-small" className="shadow-sm" />}
          />
          <div className="ml-2 mr-1">
            <Skeleton
              loading={true}
              active
              placeholder={
                <Skeleton.Title
                  active
                  style={{ width: isMobile ? 20 : 60, height: 12 }}
                />
              }
            />
          </div>
        </div>
      );
    }

    if (userState.user) {
      return (
        <Dropdown
          position="bottomRight"
          render={
            <Dropdown.Menu className={`${STYLES.modernDropdown} !rounded-2xl !border-0 !shadow-2xl`}>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/personal');
                  setMobileMenuOpen(false);
                }}
                className={`!px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 dark:hover:!from-gray-600 dark:hover:!to-gray-700 !rounded-xl !m-1 ${STYLES.transition}`}
              >
                <div className="flex items-center gap-3">
                  <IconUserSetting size="small" className="text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">{t('个人设置')}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/token');
                  setMobileMenuOpen(false);
                }}
                className={`!px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 dark:hover:!from-gray-600 dark:hover:!to-gray-700 !rounded-xl !m-1 ${STYLES.transition}`}
              >
                <div className="flex items-center gap-3">
                  <IconKey size="small" className="text-green-500 dark:text-green-400" />
                  <span className="font-medium">{t('API令牌')}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/topup');
                  setMobileMenuOpen(false);
                }}
                className={`!px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 dark:hover:!from-gray-600 dark:hover:!to-gray-700 !rounded-xl !m-1 ${STYLES.transition}`}
              >
                <div className="flex items-center gap-3">
                  <IconCreditCard size="small" className="text-purple-500 dark:text-purple-400" />
                  <span className="font-medium">{t('钱包')}</span>
                </div>
              </Dropdown.Item>
              <div className="!border-t !border-gray-200 dark:!border-gray-600 !my-1"></div>
              <Dropdown.Item 
                onClick={logout} 
                className={`!px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-red-50 hover:!to-pink-50 dark:hover:!from-red-900/20 dark:hover:!to-pink-900/20 !rounded-xl !m-1 ${STYLES.transition}`}
              >
                <div className="flex items-center gap-3">
                  <IconExit size="small" className="text-red-500 dark:text-red-400" />
                  <span className="font-medium">{t('退出')}</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button
            theme="borderless"
            type="tertiary"
            className={`flex items-center gap-2 !p-2 !rounded-xl hover:!bg-white/80 dark:hover:!bg-gray-600/80 !bg-white/60 dark:!bg-gray-700/60 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
          >
            <Avatar
              size="extra-small"
              color={stringToColor(userState.user.username)}
              className="ring-2 ring-white/50 dark:ring-gray-400/50"
            >
              {userState.user.username[0].toUpperCase()}
            </Avatar>
            <span className="hidden md:inline">
              <Typography.Text className="!text-sm !font-semibold !text-gray-700 dark:!text-gray-300">
                {userState.user.username}
              </Typography.Text>
            </span>
            <IconChevronDown className={`text-sm text-gray-500 dark:text-gray-400 ${STYLES.transition} group-hover:rotate-180`} />
          </Button>
        </Dropdown>
      );
    } else {
      const showRegisterButton = !isSelfUseMode;

      return (
        <div className="flex items-center gap-2">
          <Link to="/login" onClick={() => handleNavLinkClick('login')}>
            <Button
              theme="borderless"
              type="tertiary"
              className={`!px-6 !py-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
            >
              <span className="!text-sm !text-gray-700 dark:!text-gray-300 !font-semibold">
                {t('登录')}
              </span>
            </Button>
          </Link>
          {showRegisterButton && (
            <div className="hidden md:block">
              <Link to="/register" onClick={() => handleNavLinkClick('register')}>
                <Button
                  theme="solid"
                  type="primary"
                  className={`!px-6 !py-3 !rounded-xl !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} !border-0 !shadow-lg`}
                >
                  <span className="!text-sm !text-white !font-semibold">
                    {t('注册')}
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      );
    }
  }, [isLoading, userState.user, isMobile, navigate, logout, t, isSelfUseMode, handleNavLinkClick]);

  return (
    <header className={`text-gray-800 dark:text-gray-100 sticky top-0 z-50 ${STYLES.transition} ${STYLES.gradientBg} ${STYLES.glassMorphism} border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5`}>
      <NoticeModal
        visible={noticeVisible}
        onClose={handleNoticeClose}
        isMobile={isMobile}
        defaultTab={unreadCount > 0 ? 'system' : 'inApp'}
        unreadKeys={getUnreadKeys()}
      />
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* 左侧区域 */}
          <div className="flex items-center gap-4">
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button
                icon={
                  isConsoleRoute
                    ? ((isMobile ? drawerOpen : collapsed) ? <IconClose className="text-lg" /> : <IconMenu className="text-lg" />)
                    : (mobileMenuOpen ? <IconClose className="text-lg" /> : <IconMenu className="text-lg" />)
                }
                aria-label={
                  isConsoleRoute
                    ? ((isMobile ? drawerOpen : collapsed) ? t('关闭侧边栏') : t('打开侧边栏'))
                    : (mobileMenuOpen ? t('关闭菜单') : t('打开菜单'))
                }
                onClick={() => {
                  if (isConsoleRoute) {
                    isMobile ? onMobileMenuToggle() : toggleCollapsed();
                  } else {
                    setMobileMenuOpen(!mobileMenuOpen);
                  }
                }}
                theme="borderless"
                type="tertiary"
                className={`${STYLES.modernButton} !p-2 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Button>
            </div>

            {/* Logo */}
            <ModernLogo 
              logo={logo}
              systemName={systemName}
              isLoading={isLoading}
              onClick={() => handleNavLinkClick('home')}
            />

            {/* 模式标签 */}
            {(isSelfUseMode || isDemoSiteMode) && !isLoading && (
              <div className="hidden md:flex">
                <Tag
                  color={isSelfUseMode ? 'purple' : 'blue'}
                  className={`text-xs px-3 py-1 rounded-full font-medium shadow-md ${STYLES.transition} hover:shadow-lg`}
                  size="small"
                  shape='circle'
                >
                  {isSelfUseMode ? t('自用模式') : t('演示站点')}
                </Tag>
              </div>
            )}
            
            {/* 移动端模式标签 */}
            {(isSelfUseMode || isDemoSiteMode) && !isLoading && (
              <div className="md:hidden">
                <Tag
                  color={isSelfUseMode ? 'purple' : 'blue'}
                  className={`text-xs px-2 py-1 rounded-full font-medium shadow-md ${STYLES.transition}`}
                  size="small"
                  shape='circle'
                >
                  {isSelfUseMode ? t('自用') : t('演示')}
                </Tag>
              </div>
            )}

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-2 ml-8">
                          <NavigationLinks 
              links={mainNavLinks}
              isLoading={isLoading}
              isMobile={false}
              onLinkClick={handleNavLinkClick}
              userState={userState}
            />
            </nav>
          </div>

          {/* 右侧区域 */}
          <div className="flex items-center gap-3">
            {/* 新年彩蛋 */}
            {isNewYear && (
              <Dropdown
                position="bottomRight"
                render={
                  <Dropdown.Menu className={`${STYLES.modernDropdown} !rounded-2xl !border-0`}>
                    <Dropdown.Item 
                      onClick={handleNewYearClick} 
                      className={`!text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-yellow-50 hover:!to-orange-50 dark:hover:!from-yellow-900/20 dark:hover:!to-orange-900/20 !rounded-xl !m-1 ${STYLES.transition}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <span className="font-medium">Happy New Year!!!</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Button
                  icon={<span className="text-2xl">🎉</span>}
                  aria-label="New Year"
                  theme="borderless"
                  type="tertiary"
                  className={`${STYLES.modernButton} !p-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                </Button>
              </Dropdown>
            )}

            {/* 通知按钮 */}
            {unreadCount > 0 ? (
              <Badge count={unreadCount} type="danger" overflowCount={99}>
                <Button
                  icon={<IconBell className="text-lg" />}
                  aria-label={t('系统公告')}
                  onClick={handleNoticeOpen}
                  theme="borderless"
                  type="tertiary"
                  className={`${STYLES.modernButton} !p-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                </Button>
              </Badge>
            ) : (
              <Button
                icon={<IconBell className="text-lg" />}
                aria-label={t('系统公告')}
                onClick={handleNoticeOpen}
                theme="borderless"
                type="tertiary"
                className={`${STYLES.modernButton} !p-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Button>
            )}

            {/* 主题切换 */}
            <Button
              icon={theme === 'dark' ? <IconSun size="large" className="text-yellow-500" /> : <IconMoon size="large" className="text-gray-600 dark:text-gray-300" />}
              aria-label={t('切换主题')}
              onClick={() => setTheme(theme === 'dark' ? false : true)}
              theme="borderless"
              type="tertiary"
              className={`${STYLES.modernButton} !p-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
            </Button>

            {/* 语言切换 */}
            <Dropdown
              position="bottomRight"
              render={
                <Dropdown.Menu className={`${STYLES.modernDropdown} !rounded-2xl !border-0`}>
                  <Dropdown.Item
                    onClick={() => handleLanguageChange('zh')}
                    className={`!flex !items-center !gap-3 !px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 ${currentLang === 'zh' ? '!bg-gradient-to-r !from-blue-50 !to-purple-50 dark:!from-blue-900/30 dark:!to-purple-900/30 !font-semibold' : 'hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 dark:hover:!from-gray-600 dark:hover:!to-gray-700'} !rounded-xl !m-1 ${STYLES.transition}`}
                  >
                    <CN title="中文" className="!w-6 !h-auto rounded shadow-sm" />
                    <span className="font-medium">中文</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleLanguageChange('en')}
                    className={`!flex !items-center !gap-3 !px-4 !py-3 !text-sm !text-gray-700 dark:!text-gray-200 ${currentLang === 'en' ? '!bg-gradient-to-r !from-blue-50 !to-purple-50 dark:!from-blue-900/30 dark:!to-purple-900/30 !font-semibold' : 'hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 dark:hover:!from-gray-600 dark:hover:!to-gray-700'} !rounded-xl !m-1 ${STYLES.transition}`}
                  >
                    <GB title="English" className="!w-6 !h-auto rounded shadow-sm" />
                    <span className="font-medium">English</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Button
                icon={<IconLanguage className="text-lg" />}
                aria-label={t('切换语言')}
                theme="borderless"
                type="tertiary"
                className={`${STYLES.modernButton} !p-3 !rounded-xl !bg-white/60 dark:!bg-gray-700/60 hover:!bg-white/80 dark:hover:!bg-gray-600/80 ${STYLES.transition} ${STYLES.hoverScale} ${STYLES.hoverGlow} border border-white/30 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              </Button>
            </Dropdown>

            {/* 用户区域 */}
            {renderUserArea()}
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="md:hidden">
        <div
          className={`
            absolute top-20 left-0 right-0 ${STYLES.gradientBg} ${STYLES.glassMorphism}
            shadow-2xl p-4 border-t border-white/20 dark:border-gray-700/30
            transform transition-all duration-300 ease-out
            ${(!isConsoleRoute && mobileMenuOpen) ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible pointer-events-none'}
          `}
        >
          <nav className="flex flex-col gap-2">
            <NavigationLinks 
              links={mainNavLinks}
              isLoading={isLoading}
              isMobile={true}
              onLinkClick={handleNavLinkClick}
              userState={userState}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderBarModern;
