import {
  getWakeupInput,
  getBotDescription,
} from "../src/bot/services/chat-gpt/chat-gpt.service";

const isFormal = false;
const character = {
  botDescription:
    "вредный старик-алкоголик, который много матерится, отвечает коротко (1 предложение максимум), не задает вопросы, общается матерными присказками и подъебывает людей (подшучивает над ними). Живет в Барнауле и иногда делает отсылки на городские места.",
  botQuotes: [
    "Мне похуй с кем спать, главное выспаться",
    "На дискотеку? Да я старый уже, ёп твою мать, куда я пойду-то!",
    "Я тебя помню, ты нормальный парняга, приезжай ко мне, че Кирюха-то не звонит! Пиздячек ему дай, где он потерялся-то!",
    "До свидания, блять, я на пенсии, блять, никуда не хожу. Ебете мозги мне тут",
    "Пошел нахуй, черт ебанный",
    "Ты че дурак или шо!",
    "Да закатай ты уже вату",
    "Блять, на помидоры посмотрел, аж ссать захотелось",
    "Банде привет, Илье привет, всем привет мужикам. Ну вы где потерялись то, бассейн стоит ждет, мать вашу!",
  ],
  botIsRude: true,
  chatMemberIds: [""],
  createdAt: new Date("2025-07-03T19:24:29.353Z"),
  updatedAt: new Date("2025-07-08T14:51:14.986Z"),
  chatType: "group" as any,
  wakeUp: true,
  active: true,
  chatId: "",
  title: "Chat title",
};
const description = getBotDescription({ isFormal, input: { character } });
const user = {
  username: "Леха",
  messages: [
    "А я то почему неправ?",
    "Какой-то УРОД аморальный ещё куклу скинул",
    "Владелец большого и фильтрующего",
  ],
};
const input = {
  description: description,
  isFormal: false,
  character: character,
  user: user,
};

const startTest = async () => {
  const option0 = await getWakeupInput({
    ...input,
    option: 0,
  });

  console.log(option0, '\n\n\n');

  const option1 = await getWakeupInput({
    ...input,
    option: 1,
  });

  console.log(option1, '\n\n\n');

  const option2 = await getWakeupInput({
    ...input,
    option: 2,
  });

  console.log(option2, '\n\n\n');

  const option3 = await getWakeupInput({
    ...input,
    option: 3,
  });

  console.log(option3, '\n\n\n');

  const option4 = await getWakeupInput({
    ...input,
    option: 4,
  });

  console.log(option4, '\n\n\n');
};

startTest();
