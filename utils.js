const { connectDB } = require("./db");
global.counter = 0;

const evaluate = (details) => {
  //A candidate can get a score in range (1-4). Following are the score evalaution criteria for different fields.
  // No of languages - 30% weightage, max-score = 1.2
  // Frameworks - 25% weightage, max-score = 1
  // Projects - 25% weightage, max-score = 1
  // Skill level - 20% weightage, max-score = 0.8
  let score = 0;
  const languages = details.languages.length;
  score += languages <= 3 ? 0.4 : languages <= 6 ? 0.8 : 1.2;
  score += details.frameworks.length > 0 ? 1 : 0;
  score += details.projectsDone ? 1 : 0;
  score += (details.skillsLevel / 3) * 0.8;
  return Math.floor(score);
};

const details = {
  began: false,
  name: "",
  college: "",
  source: "",
  languages: [],
  frameworks: [],
  projectsDone: false,
  skillsLevel: 1,
  gitHub: "",
};

const get = {
  // get the name
  name: (ctx) => {
    details["name"] = ctx.message.text;
    ctx.reply("Enter your college name with city");
  },
  // get the college name
  college: (ctx) => {
    details["college"] = ctx.message.text;
    const keyboard = [
      ["Friends"],
      ["Whatsapp Group"],
      ["LinkedIn"],
      ["Facebook"],
    ];
    ctx.reply("How did you get to know about SideProject ?", {
      reply_markup: { keyboard, one_time_keyboard: true },
    });
  },
  // get the knowledge source
  source: (ctx) => {
    details["source"] = ctx.message.text;
    const keyboard = [
      ["C"],
      ["C++"],
      ["Java"],
      ["JavaScript"],
      ["Python"],
      ["CSS"],
      ["HTML"],
      ["HTML5"],
      ["C#"],
      ["Go"],
      ["Julia"],
      ["Rust"],
      ["PHP"],
      ["Objective C"],
      ["SQL"],
      ["R"],
      ["Ruby"],
      ["Rust"],
    ];
    ctx.reply("What programming languages do you know ?");
    ctx.reply("Type 'next' (withou quotes) once you are done", {
      reply_markup: { keyboard },
    });
  },
  // get the languages
  languages: (ctx) => {
    if (ctx.message.text != "next") {
      details.languages.push(ctx.message.text);
    } else {
      counter=5;
      ctx.reply("Do you know any frameworks ? PLease list them");
      ctx.reply("Type 'next' (without quotes) when you are done.");
    }
  },
  //get the frameworks
  frameworks: (ctx) => {
    if (ctx.message.text === "next") {
      counter=6;
      const keyboard = [["Yes"], ["No"]];
      ctx.reply("Have you previously done any projects ?", {
        reply_markup: { keyboard, one_time_keyboard: true },
      });
    } else {
      details.frameworks.push(ctx.message.text);
    }
  },
  // get project status
  projects: (ctx) => {
    details.projectsDone = ctx.message.text === "Yes";
    const keyboard = [
      ["Very Confident"],
      ["Confident Enough"],
      ["Still Learning"],
    ];
    ctx.reply("How confident are you about your programming skills ?", {
      reply_markup: {
        keyboard,
        one_time_keyboard: true,
      },
    });
  },
  // get skills level
  skills: (ctx) => {
    details.skillsLevel =
      ctx.message.text === "Very Confident"
        ? 3
        : ctx.message.text === "Confident Enough"
        ? 2
        : 1;
    ctx.reply(
      "Please share your github repository for us to keep track of your work"
    );
  },
  // get GitHub repo
  github: async (ctx) => {
    details.gitHub = ctx.message.text;
    details.languages = [...new Set(details.languages)];
    details.frameworks = [...new Set(details.frameworks)];
    const level = evaluate(details);
    let db = await connectDB();
    let collection = db.collection(`users`);
    await collection.insertOne(details);
    ctx.reply(
      `Based on your skill and experience, we feel you should join the SideProject levelling process at:- Level${level}\nPlease further communicate with SideProjects admin. Happy coding!`
    );
    began = false;
    counter = 0;
  },
};

module.exports = { details: details, get: get };
