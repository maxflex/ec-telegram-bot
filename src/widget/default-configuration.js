
export const defaultConfiguration = {
    titleClosed: 'Click to chat!',
    titleOpen: 'Чат ЕГЭ-Центра',
    closedStyle: 'chat', // button or chat
    closedChatAvatarUrl: '', // only used if closedStyle is set to 'chat'
    cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
    introMessage: 'Здравствуйте, задавайте ваш вопрос',
    autoResponse: 'Подождите секунду, администратор ЕГЭ-Центра вам скоро ответит',
    autoNoResponse: 'К сожалению, администрация не может ответить на ваш вопрос. ' +
    'Пожалуйста, позвоните по телефону +7 (495) 646 85-92',
    placeholderText: 'Введите сообщение...',
    displayMessageTime: true,
    mainColor: '#1f8ceb',
    alwaysUseFloatingButton: false,
    desktopHeight: 450,
    desktopWidth: 370
};
