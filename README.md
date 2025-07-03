Деплой
0) для тестов можем перед тем как делать build изменить lambda на local в esbuild.config.js, но перед тем как собирать на отправку надо вернуть обратно 
1) npm run build
2) zip -r function.zip . -x '*.git*' '*.env' 'tests/*'
3) загружаем в lambda
4) запускаем тест

Добавление в новый чат
  - написать /start
  - скопировать json поля
        "botQuotes": [
          "Мне похуй с кем спать, главное выспаться",
          "На дискотеку? Да я старый уже, ёп твою мать, куда я пойду-то?!",
          "Я тебя помню, ты нормальный парняга, приезжай ко мне, че Кирюха-то не звонит?! Пиздячек ему дай, где он потерялся-то?!",
          "До свидания, блять, я на пенсии, блять, никуда не хожу. Ебете мозги мне тут",
          "Пошел нахуй, черт ебанный",
          "Ты че дурак или шо?"
        ],
        "active": true,
        "botDescription": "вредный старик-алкоголик, который много матерится. Живет в Барнауле и иногда делает отсылки на городские места."
  - сделать его админом (но это переведет статус группы в статус супергруппы), после этого надо вызывать /start еще раз и повторить процедуру


How to deploy a bot

- создать бота и disable там приватность в botfather командой /setprivacy. 
- создать mongodb базу (или использовать ту же, но тогда надо добавить везде botId)
- настроить lambda и api-gateway
  - встраиваем lambda в приложение, надо убедиться что бд будет поднята и контроллеры зарегистрированы до того как приложение запустится
    - Также на этом шаге можно настроить чтобы lambda могла запускать события из eventBridge нужные
  - создаем lambda функцию, ставим ей таймаут секунд 15
  - создаем api-gateway
  - добавляем domain в .env
  - настраиваем proxy из API Gateway в lambda на wakeup и webhook
  - (optional) настраиваем CI
  - настраиваем доступ к openai, mongodb (внешний интернет) (просто проверяем что lambda не в VPC)
  - регистрируем telegram webhook через curl
    - РЕГИСТРАЦИЯ (можно и без SECRET_TOKEN) curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" -H "Content-Type: application/json" -d '{ "url": "<URL>", "secret_token": "<SECRET_TOKEN>" }'
    - ПРОВЕРКА curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
  - крон который дергает ручку api/wakeup настраиваем через eventBridge

Запрос в chatGPT базовый
У меня есть телеграм бот, который настроен на webhook и написан на express.js
Мне нужно задеплоить его в aws lambda + api gateway
Сначала создай мне план по шагам что нужно сделать а потом я буду с этими шагами разбираться конкретнее самостоятельно.
Мой примерное видение такое:
- создать lambda функцию
- создать api-gateway
- привязываем api-gateway к lambda на проксирование двух эндпоинтов (api/webhook, api/wakeup)
- как-то (в идеале через ci github actions) загружаем туда наш проект
- создаем через один из сервисов aws (eventBridge) cron джобу которая раз в день в определенной время дергает эндпоинт api/wakeup моего api-gateway

express (node_modules = 72 MB)
rss 79.79 MB
heapTotal 35.1 MB
heapUsed 32.95 MB
external 19.72 MB
arrayBuffers 17.43 MB

Nest.JS (node_modules = 475 MB)
rss 150.16 MB
heapTotal 71.02 MB
heapUsed 68.81 MB
external 19.68 MB
arrayBuffers 17.42 MB
