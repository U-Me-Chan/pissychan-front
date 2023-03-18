const ru = {
  deleteConfirmationMessage: 'В самом деле удалить этот пост?',
  delete: 'Удалить',
  navDown: 'Вниз',
  navUp: 'Наверх',
  settings: 'Настройки',
  settingThemes: 'Шкурки',
  settingNavDownFloating: 'Плавающая кнопка "Вниз"',
  settingEnable: 'Включить',
  settingEnabled: 'Включено',
  settingDisable: 'Выключить',
  settingDisabled: 'Выключено',
  settingSelected: 'Выбрано',
  error: 'Ошибка',
  spamTrap: 'Оставьте поля пустыми (ловушка Джокера):',
  reply: 'Ответить',
  authenticatedPoster: 'Документы на имя проверены',
  up: 'Вернуться в доску',
  name: 'Имя',
  subject: 'Тема',
  message: 'Суть',
  file: 'Файл',
  postFormExtra: 'Ещё',
  submit: 'Отправить',
  pages: 'Страницы',
  pissychan: 'Писсичан',
  posting_mode: 'Режим постинга',
  posting_mode_post: 'Новый тред',
  posting_mode_reply: 'Ответ в тред',
  posting_mode_forbidden: 'Постинг запрещён',
  posting_mode_delete: 'Удаление поста',
  parent_thread: 'Родительский тред',
  into_thread: 'В тред',
  post_count: 'Ответов в треде',
  feed: 'Недавнее',
  link_home: 'Глагне',
  sage: 'сажа',
  months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен',
    'Окт', 'Ноя', 'Дек']
}

const en = {
  deleteConfirmationMessage: 'Do you really want to delete the following post?',
  delete: 'Delete',
  navDown: 'Down',
  navUp: 'Up',
  settings: 'Settings',
  settingThemes: 'Themes',
  settingNavDownFloating: 'Floating "Down" button',
  settingEnable: 'Enable',
  settingEnabled: 'Enabled',
  settingDisable: 'Disable',
  settingDisabled: 'Disabled',
  settingSelected: 'Selected',
  error: 'Error',
  spamTrap: 'Leave these fields empty (spam trap):',
  authenticatedPoster: 'Posted by authenticated user',
  reply: 'Reply',
  up: 'Return',
  name: 'Name',
  subject: 'Subject',
  message: 'Message',
  file: 'File',
  postFormExtra: 'Extra',
  submit: 'Submit',
  pages: 'Pages',
  pissychan: 'Pissychan',
  posting_mode: 'Posting mode',
  posting_mode_post: 'New thread',
  posting_mode_reply: 'Reply in thread',
  posting_mode_forbidden: 'Forbidden',
  posting_mode_delete: 'Delete the post',
  parent_thread: 'Parent thread',
  into_thread: 'Reply',
  post_count: 'Posts count',
  feed: 'Feed',
  link_home: 'Home',
  sage: 'sage',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec']
}

const langs = {
  ru,
  en
}

module.exports = {
  byLang: function (lang) {
    return function (req, res, next) {
      req.templatingCommon = { texts: langs[lang], ...req.templatingCommon }
      next()
    }
  },
  ...langs
}
