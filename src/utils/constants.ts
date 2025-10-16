// 应用常量配置
export const APP_CONFIG = {
  APP_NAME: '诗词赏析平台',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_SEARCH_RESULTS: 50
}

// 诗词朝代选项
export const DYNASTY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '先秦', value: '先秦' },
  { label: '汉代', value: '汉代' },
  { label: '魏晋', value: '魏晋' },
  { label: '南北朝', value: '南北朝' },
  { label: '唐代', value: '唐代' },
  { label: '宋代', value: '宋代' },
  { label: '元代', value: '元代' },
  { label: '明代', value: '明代' },
  { label: '清代', value: '清代' }
]

// 热门搜索关键词
export const HOT_SEARCH_KEYWORDS = [
  '李白', '杜甫', '王维', '苏轼', '李清照',
  '唐诗三百首', '宋词', '静夜思', '春晓', '登鹳雀楼',
  '相思', '水调歌头', '将进酒', '长恨歌', '琵琶行'
]

// 诗词分类
export const POEM_CATEGORIES = [
  { id: 'landscape', name: '山水田园', icon: '🌄' },
  { id: 'frontier', name: '边塞战争', icon: '⚔️' },
  { id: 'farewell', name: '送别思乡', icon: '👋' },
  { id: 'love', name: '爱情闺怨', icon: '❤️' },
  { id: 'history', name: '咏史怀古', icon: '🏛️' },
  { id: 'philosophy', name: '哲理寓言', icon: '💭' },
  { id: 'season', name: '四季景物', icon: '🌸' }
]

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  AUTH_ERROR: '认证失败，请重新登录',
  NOT_FOUND: '请求的资源不存在',
  PERMISSION_DENIED: '权限不足，无法执行此操作'
}

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  REGISTER_SUCCESS: '注册成功',
  FAVORITE_ADDED: '收藏成功',
  FAVORITE_REMOVED: '已取消收藏'
}

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'poem_app_token',
  USER_INFO: 'poem_app_user',
  SEARCH_HISTORY: 'poem_app_search_history',
  THEME_MODE: 'poem_app_theme'
}

// API端点
export const API_ENDPOINTS = {
  POEMS: '/poems',
  AUTHORS: '/poem_authors',
  SEARCH: '/search_poems',
  FAVORITES: '/user_favorites',
  ANALYSIS: '/poem_analysis'
}

export default {
  APP_CONFIG,
  DYNASTY_OPTIONS,
  HOT_SEARCH_KEYWORDS,
  POEM_CATEGORIES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  API_ENDPOINTS
}