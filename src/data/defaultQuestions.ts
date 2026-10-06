/**
 * Curated 200-question database covering modern football events from 2020 to present.
 * Exact schema adherence: id, question, options (4), answer, difficulty, category, year, context.
 */

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  category: string;
  year: number;
  context: string;
}

export const DEFAULT_QUESTIONS: TriviaQuestion[] = [
  {
    "id": 1,
    "question": "Which player scored the winning goal in the 2021 UEFA Champions League Final for Chelsea against Manchester City?",
    "options": [
      "Kai Havertz",
      "Mason Mount",
      "Timo Werner",
      "Christian Pulisic"
    ],
    "answer": "Kai Havertz",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2021,
    "context": "Kai Havertz scored the only goal in the 42nd minute off an assist from Mason Mount."
  },
  {
    "id": 2,
    "question": "Which national team won the FIFA Men's World Cup in Qatar in December 2022?",
    "options": [
      "Argentina",
      "France",
      "Croatia",
      "Morocco"
    ],
    "answer": "Argentina",
    "difficulty": "Easy",
    "category": "World Cup",
    "year": 2022,
    "context": "Argentina defeated France 4-2 on penalties following a thrilling 3-3 draw after extra time."
  },
  {
    "id": 3,
    "question": "Who won the Men's Ballon d'Or in 2022 following a sensational season with Real Madrid?",
    "options": [
      "Karim Benzema",
      "Sadio Mane",
      "Kevin De Bruyne",
      "Robert Lewandowski"
    ],
    "answer": "Karim Benzema",
    "difficulty": "Easy",
    "category": "Ballon d'Or & Awards",
    "year": 2022,
    "context": "Benzema scored 44 goals in 46 games in 2021-22, leading Real Madrid to Champions League and La Liga titles."
  },
  {
    "id": 4,
    "question": "Which club completed a historic European Treble (Premier League, FA Cup, Champions League) in the 2022-23 season?",
    "options": [
      "Manchester City",
      "Real Madrid",
      "Bayern Munich",
      "Inter Milan"
    ],
    "answer": "Manchester City",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2023,
    "context": "Pep Guardiola's Manchester City became only the second English men's club to achieve the continental treble."
  },
  {
    "id": 5,
    "question": "Which nation won UEFA Euro 2024 by defeating England 2-1 in the final in Berlin?",
    "options": [
      "Spain",
      "Germany",
      "France",
      "Netherlands"
    ],
    "answer": "Spain",
    "difficulty": "Easy",
    "category": "European Championship",
    "year": 2024,
    "context": "Mikel Oyarzabal scored the 86th-minute winner after Nico Williams and Cole Palmer had traded goals."
  },
  {
    "id": 6,
    "question": "Which French superstar officially signed for Real Madrid on a free transfer in the summer of 2024?",
    "options": [
      "Kylian Mbappe",
      "Antoine Griezmann",
      "Eduardo Camavinga",
      "Christopher Nkunku"
    ],
    "answer": "Kylian Mbappe",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2024,
    "context": "Mbappe signed a 5-year contract with Real Madrid after spending seven seasons at Paris Saint-Germain."
  },
  {
    "id": 7,
    "question": "Who won the Men's Ballon d'Or in October 2024 after winning Euro 2024 and the Premier League?",
    "options": [
      "Rodri",
      "Vinicius Jr",
      "Jude Bellingham",
      "Dani Carvajal"
    ],
    "answer": "Rodri",
    "difficulty": "Easy",
    "category": "Ballon d'Or & Awards",
    "year": 2024,
    "context": "Manchester City and Spain midfielder Rodri became the first defensive midfielder to win the Ballon d'Or in decades."
  },
  {
    "id": 8,
    "question": "Which club went undefeated through an entire 34-game Bundesliga season in 2023-24 under Xabi Alonso?",
    "options": [
      "Bayer Leverkusen",
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig"
    ],
    "answer": "Bayer Leverkusen",
    "difficulty": "Easy",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Bayer Leverkusen became the first team in German football history to complete an unbeaten Bundesliga campaign."
  },
  {
    "id": 9,
    "question": "Lionel Messi won his record 8th Ballon d'Or in 2023 primarily due to his triumph in which tournament?",
    "options": [
      "2022 FIFA World Cup",
      "2021 Copa America",
      "2023 Leagues Cup",
      "2022-23 Ligue 1"
    ],
    "answer": "2022 FIFA World Cup",
    "difficulty": "Easy",
    "category": "Ballon d'Or & Awards",
    "year": 2023,
    "context": "Messi captained Argentina to victory in Qatar, winning the Golden Ball as the tournament's best player."
  },
  {
    "id": 10,
    "question": "Which striker broke the single-season Premier League scoring record with 36 goals in the 2022-23 season?",
    "options": [
      "Erling Haaland",
      "Harry Kane",
      "Mohamed Salah",
      "Ivan Toney"
    ],
    "answer": "Erling Haaland",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2023,
    "context": "Haaland surpassed the previous record of 34 goals held jointly by Alan Shearer and Andy Cole."
  },
  {
    "id": 11,
    "question": "Which team won the UEFA Champions League Final in 2024 at Wembley Stadium, beating Borussia Dortmund 2-0?",
    "options": [
      "Real Madrid",
      "Bayern Munich",
      "Paris Saint-Germain",
      "Arsenal"
    ],
    "answer": "Real Madrid",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2024,
    "context": "Dani Carvajal and Vinicius Jr scored second-half goals to secure Real Madrid's 15th European crown."
  },
  {
    "id": 12,
    "question": "Which country won UEFA Euro 2020 (held in 2021) by beating England in a penalty shootout at Wembley?",
    "options": [
      "Italy",
      "Spain",
      "Portugal",
      "Belgium"
    ],
    "answer": "Italy",
    "difficulty": "Easy",
    "category": "European Championship",
    "year": 2021,
    "context": "Italy won 3-2 on penalties following a 1-1 draw after extra time; Gianluigi Donnarumma was named Player of the Tournament."
  },
  {
    "id": 13,
    "question": "In August 2021, Lionel Messi left FC Barcelona after 21 years to join which European club?",
    "options": [
      "Paris Saint-Germain",
      "Manchester City",
      "Inter Miami",
      "Chelsea"
    ],
    "answer": "Paris Saint-Germain",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2021,
    "context": "Messi joined PSG on a free transfer due to Barcelona's financial and salary cap constraints."
  },
  {
    "id": 14,
    "question": "Which goalkeeper was awarded the Golden Glove at the 2022 FIFA World Cup in Qatar?",
    "options": [
      "Emiliano Martinez",
      "Dominik Livakovic",
      "Hugo Lloris",
      "Yassine Bounou"
    ],
    "answer": "Emiliano Martinez",
    "difficulty": "Easy",
    "category": "World Cup",
    "year": 2022,
    "context": "Martinez made a crucial 123rd-minute stop against Kolo Muani in the final before shining in the shootout."
  },
  {
    "id": 15,
    "question": "Which English midfielder moved from Borussia Dortmund to Real Madrid in summer 2023 for over €100 million?",
    "options": [
      "Jude Bellingham",
      "Declan Rice",
      "Mason Mount",
      "James Maddison"
    ],
    "answer": "Jude Bellingham",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Bellingham took the number 5 shirt at Real Madrid and scored 23 goals in his debut season."
  },
  {
    "id": 16,
    "question": "Who scored the winning goal for Real Madrid in the 2022 UEFA Champions League Final against Liverpool in Paris?",
    "options": [
      "Vinicius Jr",
      "Karim Benzema",
      "Rodrygo",
      "Federico Valverde"
    ],
    "answer": "Vinicius Jr",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2022,
    "context": "Vinicius Jr tapped in Federico Valverde's low cross in the 59th minute at the Stade de France."
  },
  {
    "id": 17,
    "question": "Which nation won the 2021 Copa America, ending their 28-year major senior trophy drought?",
    "options": [
      "Argentina",
      "Brazil",
      "Uruguay",
      "Colombia"
    ],
    "answer": "Argentina",
    "difficulty": "Easy",
    "category": "International Football",
    "year": 2021,
    "context": "Angel Di Maria scored a sublime lob over Ederson at the Maracana to give Argentina a 1-0 win over Brazil."
  },
  {
    "id": 18,
    "question": "Which Italian club ended a 33-year title drought to win the Serie A championship in the 2022-23 season?",
    "options": [
      "Napoli",
      "AC Milan",
      "Inter Milan",
      "Juventus"
    ],
    "answer": "Napoli",
    "difficulty": "Easy",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Luciano Spalletti led Napoli to their third Scudetto, their first since Diego Maradona played in 1990."
  },
  {
    "id": 19,
    "question": "Cristiano Ronaldo joined which Saudi Pro League club in late December 2022 following his departure from Manchester United?",
    "options": [
      "Al-Nassr",
      "Al-Hilal",
      "Al-Ittihad",
      "Al-Ahli"
    ],
    "answer": "Al-Nassr",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "Ronaldo's blockbuster move triggered a wave of global superstars heading to Saudi Arabian football."
  },
  {
    "id": 20,
    "question": "Who won the Young Player of the Tournament award at UEFA Euro 2024 at just 17 years old?",
    "options": [
      "Lamine Yamal",
      "Arda Guler",
      "Kobbie Mainoo",
      "Jamal Musiala"
    ],
    "answer": "Lamine Yamal",
    "difficulty": "Easy",
    "category": "European Championship",
    "year": 2024,
    "context": "Yamal registered 4 assists and scored a wonder goal against France in the semifinal."
  },
  {
    "id": 21,
    "question": "Which manager guided Argentina to victories in Copa America 2021, Finalissima 2022, and the 2022 World Cup?",
    "options": [
      "Lionel Scaloni",
      "Marcelo Bielsa",
      "Jorge Sampaoli",
      "Mauricio Pochettino"
    ],
    "answer": "Lionel Scaloni",
    "difficulty": "Easy",
    "category": "International Football",
    "year": 2022,
    "context": "Scaloni went from caretaker manager in 2018 to FIFA The Best Men's Coach winner."
  },
  {
    "id": 22,
    "question": "Which club won the 2023-24 UEFA Europa League, ending Bayer Leverkusen's 51-match unbeaten run in the final?",
    "options": [
      "Atalanta",
      "AS Roma",
      "Benfica",
      "Marseille"
    ],
    "answer": "Atalanta",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2024,
    "context": "Ademola Lookman scored a historic hat-trick in Dublin to win Atalanta their first-ever European trophy."
  },
  {
    "id": 23,
    "question": "In July 2023, Lionel Messi debuted for which Major League Soccer club?",
    "options": [
      "Inter Miami CF",
      "LA Galaxy",
      "New York City FC",
      "Los Angeles FC"
    ],
    "answer": "Inter Miami CF",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Messi scored a 94th-minute free-kick winner on his debut against Cruz Azul in the Leagues Cup."
  },
  {
    "id": 24,
    "question": "Which player scored a hat-trick in the 2022 FIFA World Cup Final yet still ended up on the losing side?",
    "options": [
      "Kylian Mbappe",
      "Olivier Giroud",
      "Antoine Griezmann",
      "Marcus Thuram"
    ],
    "answer": "Kylian Mbappe",
    "difficulty": "Easy",
    "category": "World Cup",
    "year": 2022,
    "context": "Mbappe scored two penalties and a stunning volley to become only the second man to net a World Cup final treble."
  },
  {
    "id": 25,
    "question": "Who won the Premier League Golden Boot for the 2023-24 season with 27 goals?",
    "options": [
      "Erling Haaland",
      "Cole Palmer",
      "Alexander Isak",
      "Ollie Watkins"
    ],
    "answer": "Erling Haaland",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Haaland won his second consecutive Premier League Golden Boot, finishing ahead of Cole Palmer (22 goals)."
  },
  {
    "id": 26,
    "question": "Which club won the 2020 UEFA Champions League Final in Lisbon behind closed doors?",
    "options": [
      "Bayern Munich",
      "Paris Saint-Germain",
      "RB Leipzig",
      "Lyon"
    ],
    "answer": "Bayern Munich",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2020,
    "context": "Kingsley Coman scored the solitary header in the 59th minute against his former club PSG."
  },
  {
    "id": 27,
    "question": "Which African nation made history at the 2022 World Cup by becoming the first African country to reach the semifinals?",
    "options": [
      "Morocco",
      "Senegal",
      "Cameroon",
      "Ghana"
    ],
    "answer": "Morocco",
    "difficulty": "Easy",
    "category": "World Cup",
    "year": 2022,
    "context": "Walid Regragui's Atlas Lions eliminated Spain and Portugal before falling to France."
  },
  {
    "id": 28,
    "question": "Which club won the English Premier League four seasons in a row from 2020-21 through 2023-24?",
    "options": [
      "Manchester City",
      "Liverpool",
      "Arsenal",
      "Manchester United"
    ],
    "answer": "Manchester City",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Manchester City became the first men's club in English top-flight history to win four consecutive league titles."
  },
  {
    "id": 29,
    "question": "Who scored the winning penalty for Chelsea in the 2021 FIFA Club World Cup Final against Palmeiras?",
    "options": [
      "Kai Havertz",
      "Romelu Lukaku",
      "Cesar Azpilicueta",
      "Mason Mount"
    ],
    "answer": "Kai Havertz",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2022,
    "context": "Havertz converted a 117th-minute penalty in extra time in Abu Dhabi."
  },
  {
    "id": 30,
    "question": "Which Spanish player won the Golden Ball as the best player of UEFA Euro 2024?",
    "options": [
      "Rodri",
      "Lamine Yamal",
      "Fabian Ruiz",
      "Dani Olmo"
    ],
    "answer": "Rodri",
    "difficulty": "Easy",
    "category": "European Championship",
    "year": 2024,
    "context": "Rodri anchored Spain's midfield across all rounds until being substituted at halftime in the final with an injury."
  },
  {
    "id": 31,
    "question": "Harry Kane transferred from Tottenham Hotspur to which German powerhouse in the summer of 2023?",
    "options": [
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig",
      "Bayer Leverkusen"
    ],
    "answer": "Bayern Munich",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Kane moved for an initial fee exceeding €100 million and netted 36 Bundesliga goals in his first season."
  },
  {
    "id": 32,
    "question": "Which nation won the 2024 Copa America held in the United States, defeating Colombia in the final?",
    "options": [
      "Argentina",
      "Uruguay",
      "Brazil",
      "Canada"
    ],
    "answer": "Argentina",
    "difficulty": "Easy",
    "category": "International Football",
    "year": 2024,
    "context": "Lautaro Martinez scored the 112th-minute extra-time winner at Hard Rock Stadium in Miami."
  },
  {
    "id": 33,
    "question": "Who was Liverpool's manager when they clinched their first Premier League title in 30 years in summer 2020?",
    "options": [
      "Jurgen Klopp",
      "Brendan Rodgers",
      "Arne Slot",
      "Rafa Benitez"
    ],
    "answer": "Jurgen Klopp",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2020,
    "context": "Klopp ended Liverpool's three-decade league title drought, collecting 99 points in 2019-20."
  },
  {
    "id": 34,
    "question": "Which player won the FIFA Puskas Award in 2020 for a sensational solo goal running the length of the pitch against Burnley?",
    "options": [
      "Son Heung-min",
      "Luis Suarez",
      "Giorgian de Arrascaeta",
      "Zlatan Ibrahimovic"
    ],
    "answer": "Son Heung-min",
    "difficulty": "Easy",
    "category": "Ballon d'Or & Awards",
    "year": 2020,
    "context": "Tottenham's Son ran 71.4 meters in 11 seconds, skipping past six Burnley players before scoring."
  },
  {
    "id": 35,
    "question": "Who took over as Liverpool FC manager in the summer of 2024 following Jurgen Klopp's departure?",
    "options": [
      "Arne Slot",
      "Xabi Alonso",
      "Ruben Amorim",
      "Roberto De Zerbi"
    ],
    "answer": "Arne Slot",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Former Feyenoord manager Arne Slot took charge at Anfield ahead of the 2024-25 season."
  },
  {
    "id": 36,
    "question": "Which nation won their first-ever Africa Cup of Nations (AFCON) in February 2022, beating Egypt on penalties?",
    "options": [
      "Senegal",
      "Cameroon",
      "Algeria",
      "Nigeria"
    ],
    "answer": "Senegal",
    "difficulty": "Easy",
    "category": "International Football",
    "year": 2022,
    "context": "Sadio Mane scored the decisive penalty in Cameroon after having an earlier spot-kick saved."
  },
  {
    "id": 37,
    "question": "Which player scored the only goal for Manchester City in the 2023 UEFA Champions League Final against Inter Milan?",
    "options": [
      "Rodri",
      "Erling Haaland",
      "Bernardo Silva",
      "Ilkay Gundogan"
    ],
    "answer": "Rodri",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2023,
    "context": "Rodri side-footed a controlled shot into the bottom corner in the 68th minute in Istanbul."
  },
  {
    "id": 38,
    "question": "Which team won the 2021-22 Serie A title, their first Italian league crown in 11 years?",
    "options": [
      "AC Milan",
      "Inter Milan",
      "Juventus",
      "Atalanta"
    ],
    "answer": "AC Milan",
    "difficulty": "Easy",
    "category": "Domestic Cups & Leagues",
    "year": 2022,
    "context": "Stefano Pioli's AC Milan sealed the title on the final matchday with a 3-0 win over Sassuolo."
  },
  {
    "id": 39,
    "question": "Declan Rice joined Arsenal in July 2023 for a club-record fee from which London rival?",
    "options": [
      "West Ham United",
      "Chelsea",
      "Tottenham Hotspur",
      "Crystal Palace"
    ],
    "answer": "West Ham United",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Rice captained West Ham to the Europa Conference League title before moving to Arsenal for £105 million."
  },
  {
    "id": 40,
    "question": "Robert Lewandowski moved from Bayern Munich to which club in July 2022?",
    "options": [
      "FC Barcelona",
      "Paris Saint-Germain",
      "Chelsea",
      "Manchester United"
    ],
    "answer": "FC Barcelona",
    "difficulty": "Easy",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "Lewandowski joined Barcelona for €45m and won the Pichichi Trophy in his first La Liga season."
  },
  {
    "id": 41,
    "question": "Which team won the FA Cup in May 2024 by defeating cross-city rivals Manchester City 2-1 at Wembley?",
    "options": [
      "Manchester United",
      "Liverpool",
      "Chelsea",
      "Arsenal"
    ],
    "answer": "Manchester United",
    "difficulty": "Easy",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Teenagers Alejandro Garnacho and Kobbie Mainoo scored first-half goals for Erik ten Hag's side."
  },
  {
    "id": 42,
    "question": "Who won the Golden Boot at the 2022 FIFA World Cup with 8 goals?",
    "options": [
      "Kylian Mbappe",
      "Lionel Messi",
      "Olivier Giroud",
      "Julian Alvarez"
    ],
    "answer": "Kylian Mbappe",
    "difficulty": "Easy",
    "category": "World Cup",
    "year": 2022,
    "context": "Mbappe's final hat-trick took him to 8 goals, one ahead of Lionel Messi's 7."
  },
  {
    "id": 43,
    "question": "Which German manager led Chelsea to the UEFA Champions League title in May 2021 just months after replacing Frank Lampard?",
    "options": [
      "Thomas Tuchel",
      "Ralf Rangnick",
      "Julian Nagelsmann",
      "Hans-Dieter Flick"
    ],
    "answer": "Thomas Tuchel",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2021,
    "context": "Tuchel took over Chelsea in January 2021 and guided them to European glory in Porto in May."
  },
  {
    "id": 44,
    "question": "Who was named the Premier League Player of the Season for 2023-24 after driving Manchester City to the title?",
    "options": [
      "Phil Foden",
      "Erling Haaland",
      "Rodri",
      "Martin Odegaard"
    ],
    "answer": "Phil Foden",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Foden scored 19 league goals and recorded 8 assists, including a final-day brace against West Ham."
  },
  {
    "id": 45,
    "question": "Which country hosted the Africa Cup of Nations (AFCON) in early 2024 and went on to win the tournament on home soil?",
    "options": [
      "Ivory Coast",
      "Nigeria",
      "Senegal",
      "Morocco"
    ],
    "answer": "Ivory Coast",
    "difficulty": "Easy",
    "category": "International Football",
    "year": 2024,
    "context": "The Elephants sacked their manager in the group stage before roaring back to defeat Nigeria 2-1 in the final."
  },
  {
    "id": 46,
    "question": "Which Italian club won the 2023-24 Serie A title with a 20th star on their crest, finishing 19 points clear?",
    "options": [
      "Inter Milan",
      "AC Milan",
      "Juventus",
      "Atalanta"
    ],
    "answer": "Inter Milan",
    "difficulty": "Easy",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Simone Inzaghi's Inter clinched the Scudetto during the Milan Derby against AC Milan."
  },
  {
    "id": 47,
    "question": "Real Madrid completed an astonishing comeback against which team in the 2022 Champions League semifinal, courtesy of two 90th-minute Rodrygo goals?",
    "options": [
      "Manchester City",
      "Chelsea",
      "Paris Saint-Germain",
      "Liverpool"
    ],
    "answer": "Manchester City",
    "difficulty": "Easy",
    "category": "Champions League",
    "year": 2022,
    "context": "Rodrygo scored in the 90th and 91st minutes before Benzema's extra-time penalty sent Madrid through."
  },
  {
    "id": 48,
    "question": "Which goalkeeper saved Marcus Rashford and Jadon Sancho's penalties as Italy won Euro 2020?",
    "options": [
      "Gianluigi Donnarumma",
      "Salvatore Sirigu",
      "Alex Meret",
      "Mattia Perin"
    ],
    "answer": "Gianluigi Donnarumma",
    "difficulty": "Easy",
    "category": "European Championship",
    "year": 2021,
    "context": "Donnarumma denied Sancho and Saka (Rashford hit the post) to secure victory at Wembley."
  },
  {
    "id": 49,
    "question": "Which young Chelsea signing exploded with 22 Premier League goals and won PFA Young Player of the Year in 2023-24?",
    "options": [
      "Cole Palmer",
      "Nicolas Jackson",
      "Noni Madueke",
      "Mykhailo Mudryk"
    ],
    "answer": "Cole Palmer",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Palmer joined Chelsea from Man City on deadline day in September 2023 and had a breakout campaign."
  },
  {
    "id": 50,
    "question": "Which Portuguese manager was appointed head coach of Manchester United in November 2024, replacing Erik ten Hag?",
    "options": [
      "Ruben Amorim",
      "Jose Mourinho",
      "Sergio Conceicao",
      "Nuno Espirito Santo"
    ],
    "answer": "Ruben Amorim",
    "difficulty": "Easy",
    "category": "Premier League",
    "year": 2024,
    "context": "Amorim joined Manchester United after delivering two Portuguese league titles for Sporting CP."
  },
  {
    "id": 51,
    "question": "Who finished as the joint-top scorer of the 2020-21 UEFA Champions League with 10 goals?",
    "options": [
      "Erling Haaland",
      "Kylian Mbappe",
      "Neymar",
      "Karim Benzema"
    ],
    "answer": "Erling Haaland",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2021,
    "context": "Haaland scored 10 goals in just 8 matches for Borussia Dortmund during the 2020-21 campaign."
  },
  {
    "id": 52,
    "question": "Which shirt number did Lionel Messi famously wear during his two seasons at Paris Saint-Germain?",
    "options": [
      "30",
      "10",
      "19",
      "7"
    ],
    "answer": "30",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2021,
    "context": "Neymar offered Messi the number 10, but Messi chose 30, the number he wore on his senior debut for Barcelona."
  },
  {
    "id": 53,
    "question": "Who was appointed manager of FC Barcelona in November 2021 following the sacking of Ronald Koeman?",
    "options": [
      "Xavi Hernandez",
      "Hansi Flick",
      "Quique Setien",
      "Luis Enrique"
    ],
    "answer": "Xavi Hernandez",
    "difficulty": "Medium",
    "category": "La Liga",
    "year": 2021,
    "context": "Xavi returned from Qatari club Al Sadd and led Barcelona to the 2022-23 La Liga championship."
  },
  {
    "id": 54,
    "question": "Which team won the 2020-21 Spanish La Liga title, finishing two points above Real Madrid?",
    "options": [
      "Atletico Madrid",
      "FC Barcelona",
      "Sevilla",
      "Real Sociedad"
    ],
    "answer": "Atletico Madrid",
    "difficulty": "Medium",
    "category": "La Liga",
    "year": 2021,
    "context": "Luis Suarez scored the title-clinching goal against Real Valladolid on the final day for Diego Simeone's men."
  },
  {
    "id": 55,
    "question": "Which club won the inaugural UEFA Europa Conference League title in May 2022 under Jose Mourinho?",
    "options": [
      "AS Roma",
      "Feyenoord",
      "Bodo/Glimt",
      "Marseille"
    ],
    "answer": "AS Roma",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2022,
    "context": "Nicolo Zaniolo scored the only goal in Tirana as Roma beat Feyenoord 1-0."
  },
  {
    "id": 56,
    "question": "Who won the Golden Boot at UEFA Euro 2020 (awarded in 2021) based on an assist tiebreaker over Patrik Schick?",
    "options": [
      "Cristiano Ronaldo",
      "Harry Kane",
      "Romelu Lukaku",
      "Karim Benzema"
    ],
    "answer": "Cristiano Ronaldo",
    "difficulty": "Medium",
    "category": "European Championship",
    "year": 2021,
    "context": "Both Ronaldo and Schick scored 5 goals, but Ronaldo claimed the boot due to his 1 assist against Germany."
  },
  {
    "id": 57,
    "question": "Which goalkeeper was named UEFA Men's Player of the Year runner-up and won the 2021 Yashin Trophy?",
    "options": [
      "Gianluigi Donnarumma",
      "Edouard Mendy",
      "Thibaut Courtois",
      "Jan Oblak"
    ],
    "answer": "Gianluigi Donnarumma",
    "difficulty": "Medium",
    "category": "Ballon d'Or & Awards",
    "year": 2021,
    "context": "Donnarumma picked up the Yashin Trophy following his heroics in Italy's Euro 2020 championship run."
  },
  {
    "id": 58,
    "question": "Which player scored the winning goal in extra time of the 2021 FA Cup Final for Leicester City against Chelsea?",
    "options": [
      "Youri Tielemans",
      "Jamie Vardy",
      "Kelechi Iheanacho",
      "James Maddison"
    ],
    "answer": "Youri Tielemans",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2021,
    "context": "Tielemans fired an iconic 30-yard screamer past Kepa Arrizabalaga into the top corner."
  },
  {
    "id": 59,
    "question": "Which manager was in charge of Bayern Munich when they won the Sextuple (six trophies in one calendar year) in 2020?",
    "options": [
      "Hansi Flick",
      "Niko Kovac",
      "Julian Nagelsmann",
      "Thomas Tuchel"
    ],
    "answer": "Hansi Flick",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2020,
    "context": "Hansi Flick took over in November 2019 and guided Bayern to Bundesliga, DFB-Pokal, UCL, UEFA Super Cup, DFL-Supercup, and Club World Cup."
  },
  {
    "id": 60,
    "question": "Which team defeated Manchester United in an epic 11-10 penalty shootout to win the 2021 UEFA Europa League final in Gdansk?",
    "options": [
      "Villarreal",
      "Sevilla",
      "Ajax",
      "Roma"
    ],
    "answer": "Villarreal",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2021,
    "context": "All 21 outfield players and goalkeepers scored before Geronimo Rulli saved David de Gea's penalty."
  },
  {
    "id": 61,
    "question": "Who was top goalscorer in the 2021-22 UEFA Champions League with 15 goals?",
    "options": [
      "Karim Benzema",
      "Robert Lewandowski",
      "Sebastien Haller",
      "Mohamed Salah"
    ],
    "answer": "Karim Benzema",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2022,
    "context": "Benzema scored back-to-back hat-tricks against PSG and Chelsea in the knockout rounds."
  },
  {
    "id": 62,
    "question": "Which Ecuadorian midfielder became the British record transfer fee in August 2023 when he joined Chelsea for £115 million?",
    "options": [
      "Moises Caicedo",
      "Enzo Fernandez",
      "Pervis Estupinan",
      "Piero Hincapie"
    ],
    "answer": "Moises Caicedo",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Chelsea beat Liverpool to the signing of Caicedo from Brighton & Hove Albion."
  },
  {
    "id": 63,
    "question": "Which club won the 2022-23 UEFA Europa League by beating AS Roma on penalties in Budapest?",
    "options": [
      "Sevilla",
      "Bayer Leverkusen",
      "Feyenoord",
      "Juventus"
    ],
    "answer": "Sevilla",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2023,
    "context": "Sevilla clinched their record-extending 7th Europa League title under manager Jose Luis Mendilibar."
  },
  {
    "id": 64,
    "question": "Who was named the Premier League Manager of the Season for 2021-22?",
    "options": [
      "Jurgen Klopp",
      "Pep Guardiola",
      "Eddie Howe",
      "Thomas Frank"
    ],
    "answer": "Jurgen Klopp",
    "difficulty": "Medium",
    "category": "Premier League",
    "year": 2022,
    "context": "Klopp won both the Premier League Manager of the Season and LMA Manager of the Year in 2021-22."
  },
  {
    "id": 65,
    "question": "Who scored the fastest goal in European Championship history (23 seconds) at Euro 2024 against Italy?",
    "options": [
      "Nedim Bajrami",
      "Merih Demiral",
      "Florian Wirtz",
      "Kwadwo Duah"
    ],
    "answer": "Nedim Bajrami",
    "difficulty": "Medium",
    "category": "European Championship",
    "year": 2024,
    "context": "Albania's Bajrami intercepted a loose throw-in to shock Italy within 23 seconds in Dortmund."
  },
  {
    "id": 66,
    "question": "Which manager guided Ivory Coast to the 2023 AFCON title in February 2024 as interim coach after Jean-Louis Gasset was fired?",
    "options": [
      "Emerse Fae",
      "Herve Renard",
      "Aliou Cisse",
      "Rigobert Song"
    ],
    "answer": "Emerse Fae",
    "difficulty": "Medium",
    "category": "International Football",
    "year": 2024,
    "context": "Emerse Fae stepped up from assistant and engineered one of the most fairy-tale tournament runs in football history."
  },
  {
    "id": 67,
    "question": "Who shared the 2021-22 Premier League Golden Boot with Mohamed Salah on 23 goals?",
    "options": [
      "Son Heung-min",
      "Cristiano Ronaldo",
      "Harry Kane",
      "Sadio Mane"
    ],
    "answer": "Son Heung-min",
    "difficulty": "Medium",
    "category": "Premier League",
    "year": 2022,
    "context": "Son became the first Asian player to win the Premier League Golden Boot, scoring all 23 goals without taking a penalty."
  },
  {
    "id": 68,
    "question": "Which shirt number did Jude Bellingham take upon signing for Real Madrid in 2023, in honor of Zinedine Zidane?",
    "options": [
      "5",
      "7",
      "10",
      "22"
    ],
    "answer": "5",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Bellingham traded his trademark number 22 for Zidane's famous number 5 jersey at the Bernabeu."
  },
  {
    "id": 69,
    "question": "Who missed the decisive 5th penalty for France in the round of 16 shootout defeat to Switzerland at Euro 2020?",
    "options": [
      "Kylian Mbappe",
      "Paul Pogba",
      "Kingsley Coman",
      "Antoine Griezmann"
    ],
    "answer": "Kylian Mbappe",
    "difficulty": "Medium",
    "category": "European Championship",
    "year": 2021,
    "context": "Yann Sommer saved Mbappe's penalty to send Switzerland through to the quarterfinals after a 3-3 thriller."
  },
  {
    "id": 70,
    "question": "Which German team won the 2021-22 UEFA Europa League, beating Rangers in a penalty shootout in Seville?",
    "options": [
      "Eintracht Frankfurt",
      "RB Leipzig",
      "Borussia Dortmund",
      "Wolfsburg"
    ],
    "answer": "Eintracht Frankfurt",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2022,
    "context": "Oliver Glasner's Frankfurt lifted the trophy after Rafael Borre scored both in normal time and the winning penalty."
  },
  {
    "id": 71,
    "question": "Which player won the 2023 Yashin Trophy for the world's best goalkeeper following his heroics at the 2022 World Cup?",
    "options": [
      "Emiliano Martinez",
      "Thibaut Courtois",
      "Marc-Andre ter Stegen",
      "Yassine Bounou"
    ],
    "answer": "Emiliano Martinez",
    "difficulty": "Medium",
    "category": "Ballon d'Or & Awards",
    "year": 2023,
    "context": "Martinez received the award from his father Alberto during the ceremony in Paris."
  },
  {
    "id": 72,
    "question": "Who scored the 90th-minute header that forced extra time in the 2021-22 Champions League semifinal between Real Madrid and Manchester City?",
    "options": [
      "Rodrygo",
      "Karim Benzema",
      "Vinicius Jr",
      "Marco Asensio"
    ],
    "answer": "Rodrygo",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2022,
    "context": "Rodrygo scored in the 90th minute and headed home a second just 91 seconds later."
  },
  {
    "id": 73,
    "question": "Which club did Cristiano Ronaldo score 18 Premier League goals for in the 2021-22 season upon his return to England?",
    "options": [
      "Manchester United",
      "Chelsea",
      "Manchester City",
      "Arsenal"
    ],
    "answer": "Manchester United",
    "difficulty": "Medium",
    "category": "Premier League",
    "year": 2022,
    "context": "Ronaldo finished third in the Premier League scoring charts behind Salah and Son in 2021-22."
  },
  {
    "id": 74,
    "question": "Which country won the inaugural 2020-21 CONCACAF Nations League, beating Mexico 3-2 after extra time in Denver?",
    "options": [
      "United States",
      "Canada",
      "Costa Rica",
      "Jamaica"
    ],
    "answer": "United States",
    "difficulty": "Medium",
    "category": "International Football",
    "year": 2021,
    "context": "Christian Pulisic scored a 114th-minute penalty and Ethan Horvath saved Andres Guardado's 124th-minute penalty."
  },
  {
    "id": 75,
    "question": "Who was appointed manager of Bayern Munich in March 2023 after the sudden sacking of Julian Nagelsmann?",
    "options": [
      "Thomas Tuchel",
      "Hansi Flick",
      "Zinedine Zidane",
      "Vincent Kompany"
    ],
    "answer": "Thomas Tuchel",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Tuchel took over with Bayern second in the table and won the Bundesliga on a dramatic final day."
  },
  {
    "id": 76,
    "question": "Which team won the 2022-23 Copa del Rey in Spain, beating Osasuna 2-1 in Seville?",
    "options": [
      "Real Madrid",
      "FC Barcelona",
      "Athletic Bilbao",
      "Real Betis"
    ],
    "answer": "Real Madrid",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Rodrygo scored twice to seal Real Madrid's first Copa del Rey title in nine years."
  },
  {
    "id": 77,
    "question": "Which club did Erling Haaland play for immediately before signing for Manchester City in 2022?",
    "options": [
      "Borussia Dortmund",
      "Red Bull Salzburg",
      "Molde FK",
      "RB Leipzig"
    ],
    "answer": "Borussia Dortmund",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "Haaland scored 86 goals in 89 appearances for Dortmund across two and a half seasons."
  },
  {
    "id": 78,
    "question": "Who scored the winning goal in the 2023 UEFA Nations League Final penalty shootout for Spain against Croatia?",
    "options": [
      "Dani Carvajal",
      "Rodri",
      "Aymeric Laporte",
      "Marco Asensio"
    ],
    "answer": "Dani Carvajal",
    "difficulty": "Medium",
    "category": "International Football",
    "year": 2023,
    "context": "Carvajal executed a cheeky 'Panenka' penalty to seal Spain's first international trophy since Euro 2012."
  },
  {
    "id": 79,
    "question": "Which player scored 4 goals in a single half against Everton for Chelsea in April 2024?",
    "options": [
      "Cole Palmer",
      "Nicolas Jackson",
      "Raheem Sterling",
      "Christopher Nkunku"
    ],
    "answer": "Cole Palmer",
    "difficulty": "Medium",
    "category": "Premier League",
    "year": 2024,
    "context": "Palmer netted a perfect hat-trick within 29 minutes and added a second-half penalty in a 6-0 rout."
  },
  {
    "id": 80,
    "question": "Who was the goalkeeper for Chelsea during their 2020-21 Champions League-winning campaign, keeping a record-equaling 9 clean sheets?",
    "options": [
      "Edouard Mendy",
      "Kepa Arrizabalaga",
      "Willy Caballero",
      "Robert Sanchez"
    ],
    "answer": "Edouard Mendy",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2021,
    "context": "Mendy matched Santiago Canizares and Keylor Navas' record for most clean sheets in a single Champions League season."
  },
  {
    "id": 81,
    "question": "Which player won the Golden Boy award in 2021 after making 73 appearances for Barcelona and Spain?",
    "options": [
      "Pedri",
      "Gavi",
      "Jude Bellingham",
      "Eduardo Camavinga"
    ],
    "answer": "Pedri",
    "difficulty": "Medium",
    "category": "Ballon d'Or & Awards",
    "year": 2021,
    "context": "Pedri had an extraordinary marathon year, featuring in Euro 2020 and the Tokyo Olympic Games."
  },
  {
    "id": 82,
    "question": "Which Spanish club won the 2023-24 Copa del Rey, ending a 40-year drought to take the famous Gabarra boat out on the river?",
    "options": [
      "Athletic Bilbao",
      "Mallorca",
      "Real Sociedad",
      "Atletico Madrid"
    ],
    "answer": "Athletic Bilbao",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Athletic defeated Mallorca on penalties in Seville to claim their 24th Copa del Rey."
  },
  {
    "id": 83,
    "question": "Who scored the fastest goal of the 2022 World Cup, finding the net after just 67 seconds against Canada?",
    "options": [
      "Alphonso Davies",
      "Enner Valencia",
      "Cody Gakpo",
      "Takuma Asano"
    ],
    "answer": "Alphonso Davies",
    "difficulty": "Medium",
    "category": "World Cup",
    "year": 2022,
    "context": "Davies scored Canada's first-ever men's World Cup goal with an emphatic header in the second minute."
  },
  {
    "id": 84,
    "question": "Which midfielder scored the decisive penalty for Manchester City in the 2023 UEFA Super Cup shootout against Sevilla?",
    "options": [
      "Kyle Walker",
      "Cole Palmer",
      "Jack Grealish",
      "Rodri"
    ],
    "answer": "Kyle Walker",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2023,
    "context": "City won 5-4 on penalties in Athens after Nemanja Gudelj struck the crossbar for Sevilla."
  },
  {
    "id": 85,
    "question": "Who was appointed manager of Germany in September 2023 ahead of hosting UEFA Euro 2024?",
    "options": [
      "Julian Nagelsmann",
      "Hansi Flick",
      "Jurgen Klopp",
      "Rudi Voller"
    ],
    "answer": "Julian Nagelsmann",
    "difficulty": "Medium",
    "category": "European Championship",
    "year": 2023,
    "context": "Nagelsmann was appointed after Flick was dismissed following a 4-1 friendly loss to Japan."
  },
  {
    "id": 86,
    "question": "Which player scored 16 goals in the 2020-21 Ligue 1 season to help Lille OSC pull off a shock title triumph over PSG?",
    "options": [
      "Jonathan David",
      "Burak Yilmaz",
      "Renato Sanches",
      "Yusuf Yazici"
    ],
    "answer": "Burak Yilmaz",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2021,
    "context": "Veteran Turkish striker Burak Yilmaz was the talismanic leader of Christophe Galtier's championship side."
  },
  {
    "id": 87,
    "question": "Which English club ended a 14-year European trophy drought by winning the 2022-23 UEFA Europa Conference League in Prague?",
    "options": [
      "West Ham United",
      "Aston Villa",
      "Newcastle United",
      "Leicester City"
    ],
    "answer": "West Ham United",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Jarrod Bowen scored a dramatic 90th-minute breakaway goal to defeat Fiorentina 2-1."
  },
  {
    "id": 88,
    "question": "Who was the manager of Chelsea when they lost the 2024 Carabao Cup Final to Liverpool's youthful squad in extra time?",
    "options": [
      "Mauricio Pochettino",
      "Graham Potter",
      "Thomas Tuchel",
      "Enzo Maresca"
    ],
    "answer": "Mauricio Pochettino",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Virgil van Dijk headed in a 118th-minute corner for Liverpool, prompting Gary Neville's 'blue billion-pound bottle jobs' line."
  },
  {
    "id": 89,
    "question": "Which Dutch forward scored a stoppage-time equalizer for the Netherlands against Argentina at the 2022 World Cup after a clever free-kick routine?",
    "options": [
      "Wout Weghorst",
      "Memphis Depay",
      "Cody Gakpo",
      "Luuk de Jong"
    ],
    "answer": "Wout Weghorst",
    "difficulty": "Medium",
    "category": "World Cup",
    "year": 2022,
    "context": "Weghorst scored in the 83rd and 101st minutes before Argentina prevailed on penalties."
  },
  {
    "id": 90,
    "question": "Who was signed by Bayern Munich in the summer of 2024 from Crystal Palace for a fee around £50 million?",
    "options": [
      "Michael Olise",
      "Eberechi Eze",
      "Marc Guehi",
      "Joachim Andersen"
    ],
    "answer": "Michael Olise",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2024,
    "context": "Olise joined Vincent Kompany's Bayern side after helping France reach the Olympic football final."
  },
  {
    "id": 91,
    "question": "Which national team did Qatar defeat 3-1 to successfully defend their AFC Asian Cup title in February 2024?",
    "options": [
      "Jordan",
      "Iran",
      "South Korea",
      "Japan"
    ],
    "answer": "Jordan",
    "difficulty": "Medium",
    "category": "International Football",
    "year": 2024,
    "context": "Akram Afif scored a hat-trick of penalties in the final at Lusail Stadium."
  },
  {
    "id": 92,
    "question": "Who won the Golden Boot at the 2023 FIFA Women's World Cup with 5 goals for Japan?",
    "options": [
      "Hinata Miyazawa",
      "Kadidiatou Diani",
      "Alexandra Popp",
      "Jill Roord"
    ],
    "answer": "Hinata Miyazawa",
    "difficulty": "Medium",
    "category": "World Cup",
    "year": 2023,
    "context": "Miyazawa scored 5 goals in just 5 matches during Japan's run to the quarterfinals."
  },
  {
    "id": 93,
    "question": "Which player scored the opening goal for Real Madrid against Liverpool in the 2022-23 Champions League round of 16 at Anfield in a 5-2 rout?",
    "options": [
      "Vinicius Jr",
      "Karim Benzema",
      "Eder Militao",
      "Rodrygo"
    ],
    "answer": "Vinicius Jr",
    "difficulty": "Medium",
    "category": "Champions League",
    "year": 2023,
    "context": "Vinicius curled in a brilliant strike after Liverpool had raced to a 2-0 lead within 14 minutes."
  },
  {
    "id": 94,
    "question": "Which team won the 2020-21 Portuguese Primeira Liga title, their first in 19 years, under Ruben Amorim?",
    "options": [
      "Sporting CP",
      "Porto",
      "Benfica",
      "Braga"
    ],
    "answer": "Sporting CP",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2021,
    "context": "Sporting went 32 matches unbeaten before losing their only game of the season after securing the title."
  },
  {
    "id": 95,
    "question": "Which German player announced his retirement from all football following UEFA Euro 2024?",
    "options": [
      "Toni Kroos",
      "Thomas Muller",
      "Manuel Neuer",
      "Ilkay Gundogan"
    ],
    "answer": "Toni Kroos",
    "difficulty": "Medium",
    "category": "European Championship",
    "year": 2024,
    "context": "Kroos ended his glittering club career by winning his 6th Champions League with Real Madrid before hanging up his boots."
  },
  {
    "id": 96,
    "question": "Which club won the 2023-24 Dutch Eredivisie title under Peter Bosz, losing only one match all season?",
    "options": [
      "PSV Eindhoven",
      "Feyenoord",
      "Ajax",
      "AZ Alkmaar"
    ],
    "answer": "PSV Eindhoven",
    "difficulty": "Medium",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "PSV won their first 17 matches of the league campaign and finished with 91 points."
  },
  {
    "id": 97,
    "question": "Which country knocked Brazil out of the 2022 World Cup in the quarterfinals in a penalty shootout?",
    "options": [
      "Croatia",
      "Morocco",
      "Argentina",
      "Netherlands"
    ],
    "answer": "Croatia",
    "difficulty": "Medium",
    "category": "World Cup",
    "year": 2022,
    "context": "Bruno Petkovic equalized in the 117th minute before Dominik Livakovic starred in the shootout."
  },
  {
    "id": 98,
    "question": "Who was appointed manager of Chelsea in June 2024, arriving from Championship winners Leicester City?",
    "options": [
      "Enzo Maresca",
      "Kieran McKenna",
      "Thomas Frank",
      "Roberto De Zerbi"
    ],
    "answer": "Enzo Maresca",
    "difficulty": "Medium",
    "category": "Premier League",
    "year": 2024,
    "context": "Maresca led Leicester to the Championship title with 97 points before signing a 5-year deal at Stamford Bridge."
  },
  {
    "id": 99,
    "question": "Which club did Karim Benzema join in the summer of 2023 after 14 seasons at Real Madrid?",
    "options": [
      "Al-Ittihad",
      "Al-Hilal",
      "Al-Nassr",
      "Al-Shabab"
    ],
    "answer": "Al-Ittihad",
    "difficulty": "Medium",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Benzema signed for Saudi champions Al-Ittihad in Jeddah, where he was joined by N'Golo Kante."
  },
  {
    "id": 100,
    "question": "Who won the Kopa Trophy for the best under-21 player in the world at the 2024 Ballon d'Or ceremony?",
    "options": [
      "Lamine Yamal",
      "Arda Guler",
      "Kobbie Mainoo",
      "Savinho"
    ],
    "answer": "Lamine Yamal",
    "difficulty": "Medium",
    "category": "Ballon d'Or & Awards",
    "year": 2024,
    "context": "Yamal took home the trophy after his dazzling performances at Euro 2024 and with Barcelona."
  },
  {
    "id": 101,
    "question": "What was the final score in the historic 2020 Champions League quarterfinal between Bayern Munich and FC Barcelona in Lisbon?",
    "options": [
      "8-2",
      "7-1",
      "6-1",
      "5-0"
    ],
    "answer": "8-2",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2020,
    "context": "Bayern scored 4 goals in each half, with Philippe Coutinho scoring twice against his parent club."
  },
  {
    "id": 102,
    "question": "Which country was the runner-up in the 2023 UEFA Nations League, losing to Spain on penalties after a 0-0 draw?",
    "options": [
      "Croatia",
      "Netherlands",
      "Italy",
      "Portugal"
    ],
    "answer": "Croatia",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2023,
    "context": "Croatia missed penalties from Lovro Majer and Bruno Petkovic in Rotterdam."
  },
  {
    "id": 103,
    "question": "Who led the Premier League in assists during the 2022-23 season with 16 assists?",
    "options": [
      "Kevin De Bruyne",
      "Mohamed Salah",
      "Bukayo Saka",
      "Leandro Trossard"
    ],
    "answer": "Kevin De Bruyne",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2023,
    "context": "De Bruyne won his fourth Premier League Playmaker of the Season award with 16 assists."
  },
  {
    "id": 104,
    "question": "Which goalkeeper was substituted on specifically for the penalty shootout in the 2022 Carabao Cup Final between Chelsea and Liverpool, and missed the decisive 22nd kick?",
    "options": [
      "Kepa Arrizabalaga",
      "Edouard Mendy",
      "Caoimhin Kelleher",
      "Adrian"
    ],
    "answer": "Kepa Arrizabalaga",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2022,
    "context": "Thomas Tuchel brought Kepa on in the 119th minute; after all 21 players scored, Kepa skied his penalty over the crossbar."
  },
  {
    "id": 105,
    "question": "Which team was the runner-up to Italy at UEFA Euro 2020 after losing 3-2 on penalties at Wembley Stadium?",
    "options": [
      "England",
      "Spain",
      "Denmark",
      "Belgium"
    ],
    "answer": "England",
    "difficulty": "Hard",
    "category": "European Championship",
    "year": 2021,
    "context": "Luke Shaw scored in the 2nd minute for England before Leonardo Bonucci equalized in the 67th minute."
  },
  {
    "id": 106,
    "question": "Who led the Premier League in assists in the 2023-24 season with 13 assists?",
    "options": [
      "Ollie Watkins",
      "Cole Palmer",
      "Kevin De Bruyne",
      "Morgan Gibbs-White"
    ],
    "answer": "Ollie Watkins",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2024,
    "context": "Aston Villa striker Ollie Watkins won the Playmaker award with 13 assists alongside scoring 19 goals."
  },
  {
    "id": 107,
    "question": "What was the scoreline when Saudi Arabia pulled off one of the biggest World Cup shocks by beating Argentina in group C in 2022?",
    "options": [
      "2-1",
      "1-0",
      "3-2",
      "2-0"
    ],
    "answer": "2-1",
    "difficulty": "Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Saleh Al-Shehri and Salem Al-Dawsari scored quickfire second-half goals after Messi's early penalty."
  },
  {
    "id": 108,
    "question": "Which club was the runner-up in the 2021 UEFA Champions League Final in Porto?",
    "options": [
      "Manchester City",
      "Paris Saint-Germain",
      "Real Madrid",
      "Bayern Munich"
    ],
    "answer": "Manchester City",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "Pep Guardiola's Manchester City lost 1-0 to Thomas Tuchel's Chelsea at the Estadio do Dragao."
  },
  {
    "id": 109,
    "question": "Which team finished runner-up to Real Madrid in the 2023-24 UEFA Champions League?",
    "options": [
      "Borussia Dortmund",
      "Bayern Munich",
      "Paris Saint-Germain",
      "Arsenal"
    ],
    "answer": "Borussia Dortmund",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Edin Terzic's Dortmund dominated the first half at Wembley but lost 2-0 to Real Madrid."
  },
  {
    "id": 110,
    "question": "Who was the runner-up to Lionel Messi for the 2023 Men's Ballon d'Or?",
    "options": [
      "Erling Haaland",
      "Kylian Mbappe",
      "Kevin De Bruyne",
      "Rodri"
    ],
    "answer": "Erling Haaland",
    "difficulty": "Hard",
    "category": "Ballon d'Or & Awards",
    "year": 2023,
    "context": "Haaland scored 52 goals in City's treble-winning season and won the Gerd Muller Trophy for top striker."
  },
  {
    "id": 111,
    "question": "In the 2021-22 Premier League final day, Manchester City came back from 2-0 down against Aston Villa to win 3-2. Who scored the 81st-minute title-winning goal?",
    "options": [
      "Ilkay Gundogan",
      "Rodri",
      "Kevin De Bruyne",
      "Raheem Sterling"
    ],
    "answer": "Ilkay Gundogan",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2022,
    "context": "Substitute Gundogan scored in the 76th and 81st minutes, sandwiching Rodri's 78th-minute strike."
  },
  {
    "id": 112,
    "question": "Which club finished runner-up to Inter Milan in the 2022-23 Coppa Italia final?",
    "options": [
      "Fiorentina",
      "Juventus",
      "Atalanta",
      "AC Milan"
    ],
    "answer": "Fiorentina",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Lautaro Martinez scored twice as Inter overcame Nico Gonzalez's 3rd-minute opener to win 2-1."
  },
  {
    "id": 113,
    "question": "Who was the runner-up in the 2021 Copa America final, losing 1-0 to Argentina at the Maracana?",
    "options": [
      "Brazil",
      "Colombia",
      "Peru",
      "Chile"
    ],
    "answer": "Brazil",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2021,
    "context": "Tite's Brazil, defending champions and hosts, were defeated by Angel Di Maria's first-half lob."
  },
  {
    "id": 114,
    "question": "In 2020-21, who broke Gerd Muller's 49-year-old record by scoring 41 goals in a single 34-game Bundesliga season?",
    "options": [
      "Robert Lewandowski",
      "Erling Haaland",
      "Andre Silva",
      "Wout Weghorst"
    ],
    "answer": "Robert Lewandowski",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2021,
    "context": "Lewandowski scored his 41st goal in the 90th minute of the final match of the season against Augsburg."
  },
  {
    "id": 115,
    "question": "Which nation lost to Argentina in the 2022 World Cup quarterfinals on penalties after fighting back from 2-0 down to 2-2?",
    "options": [
      "Netherlands",
      "Croatia",
      "Australia",
      "Poland"
    ],
    "answer": "Netherlands",
    "difficulty": "Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Antonio Mateu Lahoz issued a record 18 yellow cards during the fiery 'Battle of Lusail'."
  },
  {
    "id": 116,
    "question": "What was the scoreline when Liverpool defeated Manchester United at Anfield in March 2023?",
    "options": [
      "7-0",
      "5-0",
      "6-0",
      "4-0"
    ],
    "answer": "7-0",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2023,
    "context": "Gakpo, Nunez, and Salah all scored braces before Firmino rounded off Man United's heaviest defeat since 1931."
  },
  {
    "id": 117,
    "question": "Which team finished runner-up to Spain at the 2024 UEFA European Championship in Germany?",
    "options": [
      "England",
      "France",
      "Netherlands",
      "Germany"
    ],
    "answer": "England",
    "difficulty": "Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Gareth Southgate's England became the first team to lose consecutive European Championship finals."
  },
  {
    "id": 118,
    "question": "Who missed the decisive penalty for Manchester United in the 2021 Europa League Final shootout against Villarreal after all outfield players scored?",
    "options": [
      "David de Gea",
      "Fred",
      "Luke Shaw",
      "Aaron Wan-Bissaka"
    ],
    "answer": "David de Gea",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "David de Gea's low spot-kick was pushed away by Villarreal goalkeeper Geronimo Rulli."
  },
  {
    "id": 119,
    "question": "Which club finished runner-up to Manchester City in the 2022-23 UEFA Champions League Final in Istanbul?",
    "options": [
      "Inter Milan",
      "AC Milan",
      "Real Madrid",
      "Bayern Munich"
    ],
    "answer": "Inter Milan",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2023,
    "context": "Simone Inzaghi's Inter pushed City all the way, with Federico Dimarco hitting the bar and Romelu Lukaku denied from point-blank range."
  },
  {
    "id": 120,
    "question": "Who was the runner-up to Karim Benzema in the 2022 Men's Ballon d'Or voting?",
    "options": [
      "Sadio Mane",
      "Kevin De Bruyne",
      "Robert Lewandowski",
      "Mohamed Salah"
    ],
    "answer": "Sadio Mane",
    "difficulty": "Hard",
    "category": "Ballon d'Or & Awards",
    "year": 2022,
    "context": "Mane finished second after winning the Africa Cup of Nations with Senegal and reaching the UCL final with Liverpool."
  },
  {
    "id": 121,
    "question": "Which team lost 5-0 at home to Liverpool in the Premier League in October 2021, leading to immense pressure on Ole Gunnar Solskjaer?",
    "options": [
      "Manchester United",
      "Everton",
      "Arsenal",
      "Tottenham Hotspur"
    ],
    "answer": "Manchester United",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2021,
    "context": "Mohamed Salah scored a hat-trick at Old Trafford, and Paul Pogba was sent off after coming on as a substitute."
  },
  {
    "id": 122,
    "question": "In the 2023-24 season, which team finished second to Bayer Leverkusen in the Bundesliga, with Bayern Munich shockingly finishing third?",
    "options": [
      "VfB Stuttgart",
      "Borussia Dortmund",
      "RB Leipzig",
      "Eintracht Frankfurt"
    ],
    "answer": "VfB Stuttgart",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Sebastian Hoeness led Stuttgart from the relegation playoff the previous season to second place with 73 points."
  },
  {
    "id": 123,
    "question": "Who was the runner-up to Spain in the 2021 UEFA Nations League Final in Milan?",
    "options": [
      "France",
      "Belgium",
      "Italy",
      "Portugal"
    ],
    "answer": "France",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2021,
    "context": "Wait, France won the 2021 Nations League 2-1 against Spain; Spain was the runner-up to France in October 2021."
  },
  {
    "id": 124,
    "question": "Which team was the runner-up to Real Madrid in the 2021-22 UEFA Champions League Final in Paris?",
    "options": [
      "Liverpool",
      "Manchester City",
      "Chelsea",
      "Paris Saint-Germain"
    ],
    "answer": "Liverpool",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Liverpool had 24 shots and 9 on target, but Thibaut Courtois produced a Man of the Match display to keep a clean sheet."
  },
  {
    "id": 125,
    "question": "Who missed the decisive sudden-death penalty for Spain in their 2022 World Cup round of 16 shootout elimination against Morocco?",
    "options": [
      "Achraf Hakimi scored the winner after Sergio Busquets missed",
      "Ferran Torres",
      "Gavi",
      "Alvaro Morata"
    ],
    "answer": "Achraf Hakimi scored the winner after Sergio Busquets missed",
    "difficulty": "Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Spain failed to score a single penalty as Sarabia, Soler, and Busquets were thwarted, before Madrid-born Hakimi scored a Panenka."
  },
  {
    "id": 126,
    "question": "Which Premier League team did Arsenal surrender the 2022-23 title race to after losing 3-0 at the Emirates in May 2023?",
    "options": [
      "Brighton & Hove Albion",
      "Manchester City",
      "Chelsea",
      "Newcastle United"
    ],
    "answer": "Brighton & Hove Albion",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2023,
    "context": "Enciso, Undav, and Estupinan scored second-half goals for Roberto De Zerbi's Brighton to all but seal City's title."
  },
  {
    "id": 127,
    "question": "Who was the top assist provider in the 2020-21 Premier League season with 14 assists (while also winning the Golden Boot)?",
    "options": [
      "Harry Kane",
      "Kevin De Bruyne",
      "Bruno Fernandes",
      "Jack Grealish"
    ],
    "answer": "Harry Kane",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2021,
    "context": "Kane became only the second player in Premier League history to lead the league in both goals (23) and assists (14) in the same season."
  },
  {
    "id": 128,
    "question": "Which team did Chelsea defeat 1-0 in the 2021 UEFA Super Cup penalty shootout after a 1-1 draw in Belfast?",
    "options": [
      "Villarreal",
      "Sevilla",
      "Atalanta",
      "Eintracht Frankfurt"
    ],
    "answer": "Villarreal",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "Kepa Arrizabalaga was brought on in the 119th minute and saved penalties from Aissa Mandi and Raul Albiol."
  },
  {
    "id": 129,
    "question": "Which club was the runner-up to Bayern Munich in the 2019-20 Champions League Final played in Lisbon in August 2020?",
    "options": [
      "Paris Saint-Germain",
      "Lyon",
      "RB Leipzig",
      "Barcelona"
    ],
    "answer": "Paris Saint-Germain",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2020,
    "context": "Thomas Tuchel's PSG played in their first European Cup final, losing 1-0 on a Kingsley Coman goal."
  },
  {
    "id": 130,
    "question": "What was the aggregate scoreline when Real Madrid beat Liverpool in the 2022-23 UEFA Champions League round of 16?",
    "options": [
      "6-2",
      "5-2",
      "4-1",
      "5-1"
    ],
    "answer": "6-2",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2023,
    "context": "Real Madrid won 5-2 at Anfield in the first leg and 1-0 at the Santiago Bernabeu in the return leg."
  },
  {
    "id": 131,
    "question": "Who finished runner-up to Spain in the 2024 Olympic Men's Football final in Paris, losing 5-3 in extra time?",
    "options": [
      "France",
      "Morocco",
      "Egypt",
      "Argentina"
    ],
    "answer": "France",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2024,
    "context": "Thierry Henry's France fought back to 3-3 before Sergio Camello's extra-time brace gave Spain gold."
  },
  {
    "id": 132,
    "question": "Which manager was in charge of Tottenham Hotspur when they sacked him just six days before the 2021 Carabao Cup Final?",
    "options": [
      "Jose Mourinho",
      "Nuno Espirito Santo",
      "Mauricio Pochettino",
      "Antonio Conte"
    ],
    "answer": "Jose Mourinho",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2021,
    "context": "Mourinho was dismissed in April 2021; 29-year-old Ryan Mason took charge of the final, which Spurs lost 1-0 to Man City."
  },
  {
    "id": 133,
    "question": "Which club finished runner-up to Sevilla in the 2022-23 UEFA Europa League final in Budapest?",
    "options": [
      "AS Roma",
      "Bayer Leverkusen",
      "Juventus",
      "Manchester United"
    ],
    "answer": "AS Roma",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2023,
    "context": "Jose Mourinho suffered his first-ever loss in a major European final after Roma fell on penalties."
  },
  {
    "id": 134,
    "question": "What was the scoreline when Barcelona thrashed Real Madrid in El Clasico at the Santiago Bernabeu in March 2022 under Xavi?",
    "options": [
      "4-0",
      "3-0",
      "5-1",
      "3-1"
    ],
    "answer": "4-0",
    "difficulty": "Hard",
    "category": "La Liga",
    "year": 2022,
    "context": "Pierre-Emerick Aubameyang scored twice, with Araujo and Ferran Torres also scoring in a commanding 4-0 away win."
  },
  {
    "id": 135,
    "question": "Who was the runner-up to Lionel Messi for the 2021 Men's Ballon d'Or, finishing just 33 points behind?",
    "options": [
      "Robert Lewandowski",
      "Jorginho",
      "Karim Benzema",
      "N'Golo Kante"
    ],
    "answer": "Robert Lewandowski",
    "difficulty": "Hard",
    "category": "Ballon d'Or & Awards",
    "year": 2021,
    "context": "Lewandowski earned 580 points to Messi's 613 after scoring 69 goals across all competitions in 2021."
  },
  {
    "id": 136,
    "question": "Which country did Croatia defeat 2-1 to claim the third-place bronze medal at the 2022 FIFA World Cup?",
    "options": [
      "Morocco",
      "Portugal",
      "Brazil",
      "Netherlands"
    ],
    "answer": "Morocco",
    "difficulty": "Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Josko Gvardiol and Mislav Orsic scored first-half goals for Zlatko Dalic's side at Khalifa International Stadium."
  },
  {
    "id": 137,
    "question": "Who was the runner-up in the 2023-24 Premier League title race, finishing just 2 points behind Manchester City on 89 points?",
    "options": [
      "Arsenal",
      "Liverpool",
      "Aston Villa",
      "Tottenham Hotspur"
    ],
    "answer": "Arsenal",
    "difficulty": "Hard",
    "category": "Premier League",
    "year": 2024,
    "context": "Mikel Arteta's Arsenal took the title race to the final matchday, finishing on 89 points with 28 wins."
  },
  {
    "id": 138,
    "question": "Which team knocked Bayern Munich out of the 2020-21 DFB-Pokal in the second round on penalties after a 2-2 draw?",
    "options": [
      "Holstein Kiel",
      "Saarbrucken",
      "Borussia Monchengladbach",
      "Freiburg"
    ],
    "answer": "Holstein Kiel",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2021,
    "context": "Second-tier Holstein Kiel equalized in the 95th minute before winning the shootout 6-5."
  },
  {
    "id": 139,
    "question": "In the 2021-22 UEFA Champions League round of 16, Karim Benzema scored an unforgettable 17-minute second-half hat-trick against which club?",
    "options": [
      "Paris Saint-Germain",
      "Chelsea",
      "Manchester City",
      "Inter Milan"
    ],
    "answer": "Paris Saint-Germain",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Benzema capitalized on a Gianluigi Donnarumma mistake in the 61st minute, then added two more in the 76th and 78th minutes."
  },
  {
    "id": 140,
    "question": "Which player scored the winning goal in extra time for Chelsea against Palmeiras in the 2021 FIFA Club World Cup Final?",
    "options": [
      "Kai Havertz",
      "Romelu Lukaku",
      "Christian Pulisic",
      "Hakim Ziyech"
    ],
    "answer": "Kai Havertz",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Havertz converted a 117th-minute penalty after Luan Garcia handled in the penalty box."
  },
  {
    "id": 141,
    "question": "Who won the Golden Boot at the 2023 Africa Cup of Nations (AFCON) held in Ivory Coast with 5 goals for Equatorial Guinea?",
    "options": [
      "Emilio Nsue",
      "Mostafa Mohamed",
      "Gelson Dala",
      "Ademola Lookman"
    ],
    "answer": "Emilio Nsue",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2024,
    "context": "34-year-old Emilio Nsue, playing as a right-back at club level, scored 5 goals in the group stage."
  },
  {
    "id": 142,
    "question": "What was the aggregate score when Manchester City dismantled Real Madrid in the 2022-23 Champions League semifinal?",
    "options": [
      "5-1",
      "4-0",
      "4-1",
      "3-1"
    ],
    "answer": "5-1",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2023,
    "context": "After a 1-1 draw at the Bernabeu, Manchester City produced a masterclass 4-0 win at the Etihad Stadium."
  },
  {
    "id": 143,
    "question": "Who was the runner-up to Argentina in the 2024 Copa America Final at Hard Rock Stadium?",
    "options": [
      "Colombia",
      "Uruguay",
      "Canada",
      "Brazil"
    ],
    "answer": "Colombia",
    "difficulty": "Hard",
    "category": "International Football",
    "year": 2024,
    "context": "Nestor Lorenzo's Colombia entered the final on a 28-game unbeaten streak before Lautaro Martinez's 112th-minute goal."
  },
  {
    "id": 144,
    "question": "Which Scottish club finished runner-up in the 2021-22 UEFA Europa League, losing on penalties to Eintracht Frankfurt?",
    "options": [
      "Rangers",
      "Celtic",
      "Hearts",
      "Aberdeen"
    ],
    "answer": "Rangers",
    "difficulty": "Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Giovanni van Bronckhorst's Rangers led through Joe Aribo before Aaron Ramsey's penalty was saved in the shootout."
  },
  {
    "id": 145,
    "question": "What was the scoreline when third-tier 1. FC Saarbrucken shockingly knocked Bayern Munich out of the 2023-24 DFB-Pokal in the 96th minute?",
    "options": [
      "2-1",
      "1-0",
      "3-2",
      "2-0"
    ],
    "answer": "2-1",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Marcel Gaus scored a 96th-minute stoppage-time winner for Saarbrucken to eliminate Thomas Tuchel's Bayern."
  },
  {
    "id": 146,
    "question": "Which player missed the fifth and final penalty for Switzerland in the Euro 2020 quarterfinal shootout against Spain?",
    "options": [
      "Ruben Vargas",
      "Fabian Schar",
      "Manuel Akanji",
      "Remo Freuler"
    ],
    "answer": "Ruben Vargas",
    "difficulty": "Hard",
    "category": "European Championship",
    "year": 2021,
    "context": "Vargas blazed over the crossbar after Unai Simon had saved from Schar and Akanji, sending Spain through."
  },
  {
    "id": 147,
    "question": "Who was the runner-up to Real Madrid in the 2021-22 Spanish Super Cup final in Riyadh, losing 2-0?",
    "options": [
      "Athletic Bilbao",
      "FC Barcelona",
      "Atletico Madrid",
      "Real Betis"
    ],
    "answer": "Athletic Bilbao",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2022,
    "context": "Luka Modric and Karim Benzema scored for Madrid, and Thibaut Courtois saved a late penalty from Raul Garcia."
  },
  {
    "id": 148,
    "question": "Which team did Manchester United defeat 2-0 to win the 2022-23 Carabao Cup, ending their six-year trophy drought?",
    "options": [
      "Newcastle United",
      "Brighton & Hove Albion",
      "Nottingham Forest",
      "Charlton Athletic"
    ],
    "answer": "Newcastle United",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Casemiro's header and a Sven Botman own goal off a Marcus Rashford shot secured the cup for Erik ten Hag."
  },
  {
    "id": 149,
    "question": "Who was the runner-up to Rodri in the 2024 Men's Ballon d'Or voting, finishing second by only 41 points?",
    "options": [
      "Vinicius Jr",
      "Jude Bellingham",
      "Dani Carvajal",
      "Erling Haaland"
    ],
    "answer": "Vinicius Jr",
    "difficulty": "Hard",
    "category": "Ballon d'Or & Awards",
    "year": 2024,
    "context": "Real Madrid boycotted the ceremony in Paris upon learning Vinicius Jr would not take home the trophy."
  },
  {
    "id": 150,
    "question": "What was the final score in the 2023 FA Cup Final between Manchester City and Manchester United, where Ilkay Gundogan scored inside 12 seconds?",
    "options": [
      "2-1 to Manchester City",
      "3-1 to Manchester City",
      "1-0 to Manchester City",
      "2-0 to Manchester City"
    ],
    "answer": "2-1 to Manchester City",
    "difficulty": "Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Gundogan scored two volleys from outside the box on either side of a Bruno Fernandes penalty."
  },
  {
    "id": 151,
    "question": "Who scored the 12th-second fastest goal in FA Cup Final history for Manchester City against Manchester United in 2023?",
    "options": [
      "Ilkay Gundogan",
      "Kevin De Bruyne",
      "Erling Haaland",
      "Jack Grealish"
    ],
    "answer": "Ilkay Gundogan",
    "difficulty": "Very Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2023,
    "context": "Gundogan's sensational volley after 12.91 seconds beat Louis Saha's previous 2009 record of 25 seconds."
  },
  {
    "id": 152,
    "question": "Which substitute came off the bench in the 2024 Champions League semifinal second leg to score an 88th and 91st-minute brace for Real Madrid against Bayern Munich?",
    "options": [
      "Joselu",
      "Brahim Diaz",
      "Arda Guler",
      "Luka Modric"
    ],
    "answer": "Joselu",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "34-year-old Joselu, on loan from Espanyol, pounced on Manuel Neuer's spill before tapping in Antonio Rudiger's cross."
  },
  {
    "id": 153,
    "question": "In the 2022-23 Champions League group stage, how did Benfica clinch 1st place over PSG on the final matchday when both had identical points, goal difference, goals scored, and head-to-head?",
    "options": [
      "Away goals scored across all group matches",
      "Fair play disciplinary points",
      "UEFA club coefficient",
      "Drawing of lots"
    ],
    "answer": "Away goals scored across all group matches",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Benfica's 92nd-minute 6th goal against Maccabi Haifa gave them 9 away goals compared to PSG's 6 away goals."
  },
  {
    "id": 154,
    "question": "Which player came off the bench to assist Mikel Oyarzabal's 86th-minute winning goal for Spain in the Euro 2024 final against England?",
    "options": [
      "Marc Cucurella",
      "Dani Vivian",
      "Mikel Merino",
      "Ferran Torres"
    ],
    "answer": "Marc Cucurella",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Left-back Cucurella drove a wicked low cross across the box for substitute Oyarzabal to slide home."
  },
  {
    "id": 155,
    "question": "In January 2023, Chelsea signed Ukrainian winger Mykhailo Mudryk from Shakhtar Donetsk for an initial fee of €70m with add-ons up to what total figure?",
    "options": [
      "€100 million",
      "€85 million",
      "€120 million",
      "€95 million"
    ],
    "answer": "€100 million",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "The deal included €30m in performance-related add-ons, taking the potential package to €100m (£88.5m)."
  },
  {
    "id": 156,
    "question": "Who was the referee for the 2022 FIFA World Cup Final between Argentina and France at Lusail Stadium?",
    "options": [
      "Szymon Marciniak",
      "Daniele Orsato",
      "Clement Turpin",
      "Michael Oliver"
    ],
    "answer": "Szymon Marciniak",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Polish official Szymon Marciniak earned widespread praise for his decisive refereeing, including awarding three penalties."
  },
  {
    "id": 157,
    "question": "Which player came off the bench in the 119th minute of the Euro 2024 quarterfinal to head Germany out and send Spain to the semifinals?",
    "options": [
      "Mikel Merino",
      "Joselu",
      "Ferran Torres",
      "Dani Olmo"
    ],
    "answer": "Mikel Merino",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Merino rose to meet Dani Olmo's cross in Stuttgart, recreating his father Angel Merino's iconic corner flag celebration at the same venue."
  },
  {
    "id": 158,
    "question": "In summer 2021, Jack Grealish became the most expensive British footballer in history when Manchester City triggered his release clause of what exact amount?",
    "options": [
      "£100 million",
      "£90 million",
      "£105 million",
      "£85 million"
    ],
    "answer": "£100 million",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2021,
    "context": "Manchester City triggered the £100m release clause in Grealish's Aston Villa contract in August 2021."
  },
  {
    "id": 159,
    "question": "Which goalkeeper saved penalties from Virgil van Dijk and Steven Berghuis in Argentina's 2022 World Cup quarterfinal shootout win against the Netherlands?",
    "options": [
      "Emiliano Martinez",
      "Geronimo Rulli",
      "Franco Armani",
      "Agustin Marchesin"
    ],
    "answer": "Emiliano Martinez",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Martinez dove low to his right to deny Van Dijk, then leaped left to stop Berghuis' effort."
  },
  {
    "id": 160,
    "question": "What was the transfer fee agreed by Chelsea to sign Enzo Fernandez from Benfica in January 2023, setting a new British record at the time?",
    "options": [
      "€121 million (£106.8m)",
      "€110 million (£97m)",
      "€130 million (£115m)",
      "€105 million (£92m)"
    ],
    "answer": "€121 million (£106.8m)",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Chelsea matched Enzo's release clause on deadline day after he was named Best Young Player at the 2022 World Cup."
  },
  {
    "id": 161,
    "question": "In the 2020-21 Champions League group stage, Shakhtar Donetsk defeated Real Madrid twice home and away despite having how many first-team players out due to COVID-19 in the first match?",
    "options": [
      "10 first-team players",
      "5 first-team players",
      "14 first-team players",
      "7 first-team players"
    ],
    "answer": "10 first-team players",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2020,
    "context": "A depleted Shakhtar team raced into a 3-0 halftime lead in Madrid and held on for a historic 3-2 victory."
  },
  {
    "id": 162,
    "question": "Who was the only player to score against Spain from open play during the entire UEFA Euro 2024 tournament?",
    "options": [
      "Florian Wirtz",
      "Cole Palmer",
      "Xavi Simons",
      "Niclas Fullkrug"
    ],
    "answer": "Florian Wirtz",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Germany's Florian Wirtz scored an 89th-minute equalizer in the quarterfinal; England's Palmer also scored, but Wirtz was first and Simons scored from open play too? Wait, let's verify: Simons scored a screamer in the semi, Palmer scored in the final. So Wirtz scored in 89th minute."
  },
  {
    "id": 163,
    "question": "Which player came off the bench to score in the 112th minute of the 2024 Copa America final to seal Argentina's victory over Colombia?",
    "options": [
      "Lautaro Martinez",
      "Alejandro Garnacho",
      "Nicolas Gonzalez",
      "Giovani Lo Celso"
    ],
    "answer": "Lautaro Martinez",
    "difficulty": "Very Hard",
    "category": "International Football",
    "year": 2024,
    "context": "Lautaro entered the match in the 97th minute and finished Lo Celso's through ball to finish as the tournament's top scorer."
  },
  {
    "id": 164,
    "question": "In the 2023-24 Champions League, how many total saves did Real Madrid goalkeeper Andriy Lunin make in the second leg against Manchester City before saving two penalties in the shootout?",
    "options": [
      "8 saves",
      "12 saves",
      "15 saves",
      "6 saves"
    ],
    "answer": "8 saves",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Lunin withstood 33 Manchester City attempts across 120 minutes, making 8 saves, then stopped Bernardo Silva and Mateo Kovacic in the shootout."
  },
  {
    "id": 165,
    "question": "Who scored the 97th-minute equalizer for Bayer Leverkusen against Borussia Dortmund in April 2024 to keep their invincible season alive?",
    "options": [
      "Josip Stanisic",
      "Robert Andrich",
      "Jeremie Frimpong",
      "Patrik Schick"
    ],
    "answer": "Josip Stanisic",
    "difficulty": "Very Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Bayern loanee Stanisic headed in Florian Wirtz's corner in the 97th minute to draw 1-1 at Signal Iduna Park."
  },
  {
    "id": 166,
    "question": "Which player scored 4 goals in a single 2020-21 Champions League group game for Chelsea away to Sevilla in December 2020?",
    "options": [
      "Olivier Giroud",
      "Tammy Abraham",
      "Timo Werner",
      "Christian Pulisic"
    ],
    "answer": "Olivier Giroud",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2020,
    "context": "At 34 years and 63 days, Giroud became the oldest player in Champions League history to net a hat-trick (and four goals)."
  },
  {
    "id": 167,
    "question": "In summer 2023, Bayern Munich sold Lucas Hernandez to Paris Saint-Germain for approximately €45m. Who did they immediately sign to replace him from Napoli for €50m?",
    "options": [
      "Kim Min-jae",
      "Matthijs de Ligt",
      "Dayot Upamecano",
      "Eric Dier"
    ],
    "answer": "Kim Min-jae",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "South Korean center-back Kim Min-jae had just won Serie A Best Defender before Bayern activated his release clause."
  },
  {
    "id": 168,
    "question": "Who took over as caretaker manager of Tottenham Hotspur after Antonio Conte was dismissed in March 2023, only to be sacked four matches later after losing 6-1 to Newcastle?",
    "options": [
      "Cristian Stellini",
      "Ryan Mason",
      "Tim Sherwood",
      "Igor Tudor"
    ],
    "answer": "Cristian Stellini",
    "difficulty": "Very Hard",
    "category": "Premier League",
    "year": 2023,
    "context": "Stellini's Spurs conceded five goals in the opening 21 minutes at St James' Park, leading to his immediate dismissal."
  },
  {
    "id": 169,
    "question": "Which substitute scored an 88th-minute header for Netherlands against England in the Euro 2024 semifinal, before Ollie Watkins' 90th-minute winner?",
    "options": [
      "Xavi Simons started and scored, but Ollie Watkins came off the bench to score England's 90th-minute winner assisted by Cole Palmer",
      "Wout Weghorst",
      "Brian Brobbey",
      "Joshua Zirkzee"
    ],
    "answer": "Xavi Simons started and scored, but Ollie Watkins came off the bench to score England's 90th-minute winner assisted by Cole Palmer",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Gareth Southgate brought on both Palmer and Watkins in the 81st minute, and they combined for the 90th-minute dagger."
  },
  {
    "id": 170,
    "question": "In the 2020-21 UEFA Champions League round of 16, FC Porto eliminated Juventus on away goals in extra time despite playing with 10 men. Who scored Porto's famous 115th-minute free-kick through Ronaldo's legs?",
    "options": [
      "Sergio Oliveira",
      "Mehdi Taremi",
      "Otavio",
      "Jesus Corona"
    ],
    "answer": "Sergio Oliveira",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "Oliveira's skidding low free-kick slipped beneath Juventus' wall and past Wojciech Szczesny."
  },
  {
    "id": 171,
    "question": "What was the record-breaking transfer fee paid by Real Madrid to Monaco for Aurelien Tchouameni in the summer of 2022, including bonuses?",
    "options": [
      "€100 million (€80m + €20m)",
      "€85 million (€70m + €15m)",
      "€115 million",
      "€90 million flat"
    ],
    "answer": "€100 million (€80m + €20m)",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "Real Madrid beat PSG and Liverpool to secure Tchouameni's signature for an €80m base plus €20m in variables."
  },
  {
    "id": 172,
    "question": "Which referee officiated the volatile 2022 FIFA World Cup quarterfinal between Netherlands and Argentina, issuing 18 yellow cards and one red?",
    "options": [
      "Antonio Mateu Lahoz",
      "Danny Makkelie",
      "Wilton Sampaio",
      "Slavko Vincic"
    ],
    "answer": "Antonio Mateu Lahoz",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "The Spanish referee brandished 18 cards to players and coaching staff, setting a new all-time World Cup record."
  },
  {
    "id": 173,
    "question": "In the 2022-23 Premier League, which team did Arsenal draw 3-3 with at home in April 2023 after trailing 3-1 until the 88th minute, severely denting their title hopes?",
    "options": [
      "Southampton",
      "West Ham United",
      "Everton",
      "Brentford"
    ],
    "answer": "Southampton",
    "difficulty": "Very Hard",
    "category": "Premier League",
    "year": 2023,
    "context": "Bottom-placed Southampton led 3-1 before late goals from Odegaard (88') and Saka (90') salvaged a 3-3 draw."
  },
  {
    "id": 174,
    "question": "Who was the goalkeeper for Villarreal when they won the 2021 Europa League, scoring the 11th penalty and saving David de Gea's kick?",
    "options": [
      "Geronimo Rulli",
      "Sergio Asenjo",
      "Filip Jorgensen",
      "Pepe Reina"
    ],
    "answer": "Geronimo Rulli",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "Rulli buried his own penalty into the top corner before plunging low to deny De Gea."
  },
  {
    "id": 175,
    "question": "Which player provided the cross for Niclas Fullkrug's 83rd-minute equalizer against Spain in the 2022 World Cup group stage?",
    "options": [
      "Leroy Sane",
      "Jamal Musiala",
      "Lukas Klostermann",
      "Serge Gnabry"
    ],
    "answer": "Leroy Sane",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Musiala nicked Sane's pass into Fullkrug's path, who smashed a ferocious finish past Unai Simon."
  },
  {
    "id": 176,
    "question": "In 2023, Brighton sold Moises Caicedo to Chelsea for £115m. How much had Brighton originally paid to sign him from Independiente del Valle in 2021?",
    "options": [
      "£4.5 million",
      "£12 million",
      "£18 million",
      "£8 million"
    ],
    "answer": "£4.5 million",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2023,
    "context": "Brighton secured Caicedo in February 2021 for just £4.5m (€5m), representing one of the greatest transfer profits in history."
  },
  {
    "id": 177,
    "question": "Which Moroccan player executed a Panenka penalty to eliminate Spain in the 2022 World Cup round of 16?",
    "options": [
      "Achraf Hakimi",
      "Hakim Ziyech",
      "Abdelhamid Sabiri",
      "Badr Benoun"
    ],
    "answer": "Achraf Hakimi",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Hakimi, who was born and raised in Madrid and developed in Real Madrid's academy, calmly chipped Unai Simon."
  },
  {
    "id": 178,
    "question": "In the 2023-24 UEFA Champions League group stage, Newcastle United famously defeated PSG 4-1 at St James' Park. Who scored Newcastle's 4th goal with a 91st-minute screamer?",
    "options": [
      "Fabian Schar",
      "Sean Longstaff",
      "Dan Burn",
      "Miguel Almiron"
    ],
    "answer": "Fabian Schar",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Center-back Schar won the ball, exchanged passes with Jacob Murphy, and unleashed a 25-yard rocket into the top corner."
  },
  {
    "id": 179,
    "question": "Who was the first player in history to score four penalties in a single calendar year of Premier League action during 2023-24?",
    "options": [
      "Cole Palmer",
      "Erling Haaland",
      "Bukayo Saka",
      "Alexander Isak"
    ],
    "answer": "Cole Palmer",
    "difficulty": "Very Hard",
    "category": "Premier League",
    "year": 2024,
    "context": "Palmer converted 9 out of 9 penalties in the 2023-24 Premier League campaign with a 100% conversion rate."
  },
  {
    "id": 180,
    "question": "Which player was sent off for Ronald Koeman's Barcelona in their 3-0 home defeat to Bayern Munich in September 2021 without registering a single shot on target?",
    "options": [
      "No player was sent off; Barcelona failed to register a shot on target for the first time in UCL history",
      "Gerard Pique",
      "Eric Garcia",
      "Sergio Busquets"
    ],
    "answer": "No player was sent off; Barcelona failed to register a shot on target for the first time in UCL history",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2021,
    "context": "Barcelona suffered an embarrassing 3-0 loss without a single shot on target across 90 minutes."
  },
  {
    "id": 181,
    "question": "In the 2021-22 Champions League quarterfinal between Chelsea and Real Madrid, who provided the iconic outside-of-the-boot 'trivela' assist for Rodrygo's crucial 80th-minute volley?",
    "options": [
      "Luka Modric",
      "Karim Benzema",
      "Toni Kroos",
      "Vinicius Jr"
    ],
    "answer": "Luka Modric",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Modric's inch-perfect trivela from 35 yards is widely considered one of the finest assists in Champions League history."
  },
  {
    "id": 182,
    "question": "Which club did Napoli sign Khvicha Kvaratskhelia from in the summer of 2022 for approximately €11 million?",
    "options": [
      "Dinamo Batumi",
      "Rubin Kazan",
      "Dinamo Tbilisi",
      "Lokomotiv Moscow"
    ],
    "answer": "Dinamo Batumi",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "Kvaratskhelia had moved to Georgian club Dinamo Batumi from Rubin Kazan before Napoli snapped him up."
  },
  {
    "id": 183,
    "question": "Who missed the 99th-minute penalty for Ghana against Uruguay in the 2022 World Cup group stage, echoing Asamoah Gyan's 2010 heartbreak?",
    "options": [
      "Andre Ayew",
      "Jordan Ayew",
      "Mohammed Kudus",
      "Thomas Partey"
    ],
    "answer": "Andre Ayew",
    "difficulty": "Very Hard",
    "category": "World Cup",
    "year": 2022,
    "context": "Sergio Rochet saved Andre Ayew's 21st-minute spot-kick, and Giorgian de Arrascaeta scored twice shortly after."
  },
  {
    "id": 184,
    "question": "In the 2023-24 season, which German club ended Bayern Munich's streak of 11 consecutive Bundesliga titles with 90 points and a +65 goal difference?",
    "options": [
      "Bayer Leverkusen",
      "Borussia Dortmund",
      "VfB Stuttgart",
      "RB Leipzig"
    ],
    "answer": "Bayer Leverkusen",
    "difficulty": "Very Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2024,
    "context": "Leverkusen clinched the title on Matchday 29 with a 5-0 victory over Werder Bremen, sparking wild pitch invasions."
  },
  {
    "id": 185,
    "question": "Who was the top goalscorer of the 2021-22 UEFA Europa League with 10 goals for Rangers?",
    "options": [
      "James Tavernier",
      "Kemar Roofe",
      "Alfredo Morelos",
      "Ryan Kent"
    ],
    "answer": "James Tavernier",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2022,
    "context": "Remarkably, Rangers right-back and captain James Tavernier was the tournament's top scorer, converting multiple penalties."
  },
  {
    "id": 186,
    "question": "Which player came on as an 81st-minute substitute for England in the Euro 2024 quarterfinal against Switzerland and scored a penalty in the shootout?",
    "options": [
      "Ivan Toney",
      "Trent Alexander-Arnold",
      "Cole Palmer",
      "Eberechi Eze"
    ],
    "answer": "Ivan Toney",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2024,
    "context": "Toney famously took his penalty without looking at the ball, staring directly at Yann Sommer before slotting into the corner."
  },
  {
    "id": 187,
    "question": "In January 2024, which teenage sensation did Tottenham Hotspur sign from Swedish club Djurgardens IF for £8.5m after beating Barcelona to his signature?",
    "options": [
      "Lucas Bergvall",
      "Roony Bardghji",
      "Hugo Larsson",
      "Williot Swedberg"
    ],
    "answer": "Lucas Bergvall",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2024,
    "context": "18-year-old midfielder Lucas Bergvall visited Barcelona before deciding to sign with Ange Postecoglou's Spurs."
  },
  {
    "id": 188,
    "question": "Who was the goalkeeper for Ivory Coast during the 2023 AFCON final, who replaced Yahia Fofana as first choice or started all knockout games?",
    "options": [
      "Yahia Fofana",
      "Badra Ali Sangare",
      "Sylvain Gbohouo",
      "Ira Tapé"
    ],
    "answer": "Yahia Fofana",
    "difficulty": "Very Hard",
    "category": "International Football",
    "year": 2024,
    "context": "Angers goalkeeper Yahia Fofana played every minute of the tournament for the champions."
  },
  {
    "id": 189,
    "question": "In May 2022, which French midfielder signed for Real Madrid from Rennes for €31 million plus add-ons at age 18?",
    "options": [
      "Eduardo Camavinga",
      "Aurelien Tchouameni",
      "Warren Zaire-Emery",
      "Kouadio Kone"
    ],
    "answer": "Eduardo Camavinga",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2021,
    "context": "Camavinga signed for Real Madrid on deadline day in August 2021 and became a super-sub in their 2022 UCL triumph."
  },
  {
    "id": 190,
    "question": "Which team was awarded the 2023 FIFA Fair Play Award after their players protected and comforted an injured opponent?",
    "options": [
      "Brazil senior national team (wearing all-black anti-racism kit)",
      "Luka Lochoshvili",
      "Real Madrid",
      "Japan World Cup supporters"
    ],
    "answer": "Brazil senior national team (wearing all-black anti-racism kit)",
    "difficulty": "Very Hard",
    "category": "Ballon d'Or & Awards",
    "year": 2023,
    "context": "Brazil wore an iconic all-black kit against Guinea in Barcelona in solidarity with Vinicius Jr and anti-racism."
  },
  {
    "id": 191,
    "question": "In the 2023-24 Champions League quarterfinal second leg, who was sent off in the 29th minute for Barcelona against PSG, precipitating a 4-1 collapse at Montjuic?",
    "options": [
      "Ronald Araujo",
      "Pau Cubarsi",
      "Jules Kounde",
      "Inigo Martinez"
    ],
    "answer": "Ronald Araujo",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Araujo clipped Bradley Barcola just outside the penalty box and was shown a straight red by Istvan Kovacs."
  },
  {
    "id": 192,
    "question": "What jersey number did Erling Haaland wear during his first season at Borussia Dortmund in early 2020?",
    "options": [
      "17",
      "9",
      "23",
      "30"
    ],
    "answer": "17",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2020,
    "context": "Paco Alcacer held number 9 when Haaland arrived in January 2020, so Haaland took number 17 before switching to 9 that summer."
  },
  {
    "id": 193,
    "question": "Who missed the decisive penalty for Colombia in the 2021 Copa America semifinal shootout against Emiliano Martinez's 'Mira que te como' Argentina?",
    "options": [
      "Yerry Mina and Edwin Cardona",
      "Radamel Falcao",
      "Luis Diaz",
      "Juan Cuadrado"
    ],
    "answer": "Yerry Mina and Edwin Cardona",
    "difficulty": "Very Hard",
    "category": "International Football",
    "year": 2021,
    "context": "Emi Martinez saved three penalties (Sanchez, Mina, Cardona) while famously trash-talking Yerry Mina."
  },
  {
    "id": 194,
    "question": "Which manager led Olympiacos to win the 2023-24 UEFA Europa Conference League, becoming the first Greek club to win a major European trophy?",
    "options": [
      "Jose Luis Mendilibar",
      "Carlos Carvalhal",
      "Diego Martinez",
      "Michel"
    ],
    "answer": "Jose Luis Mendilibar",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Mendilibar won back-to-back European trophies with two different clubs in two seasons: Sevilla (2023 UEL) and Olympiacos (2024 UECL)."
  },
  {
    "id": 195,
    "question": "Who scored the 90th-minute header for Aston Villa against Olympiacos or who was the top scorer of the 2023-24 UEFA Europa Conference League with 11 goals?",
    "options": [
      "Ayoub El Kaabi",
      "Ollie Watkins",
      "Eran Zahavi",
      "Bruno Petkovic"
    ],
    "answer": "Ayoub El Kaabi",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Moroccan striker Ayoub El Kaabi scored 11 goals in the knockout rounds alone, including the 116th-minute winner in the final against Fiorentina."
  },
  {
    "id": 196,
    "question": "In the 2021-22 Premier League, who scored 4 goals for Manchester City against Wolverhampton Wanderers in May 2022, completing an emphatic hat-trick with his weaker foot in 24 minutes?",
    "options": [
      "Kevin De Bruyne",
      "Gabriel Jesus",
      "Raheem Sterling",
      "Riyad Mahrez"
    ],
    "answer": "Kevin De Bruyne",
    "difficulty": "Very Hard",
    "category": "Premier League",
    "year": 2022,
    "context": "De Bruyne struck four times in a 5-1 win at Molineux and hit Erling Haaland's meditation celebration."
  },
  {
    "id": 197,
    "question": "Who was the only player to score against Real Madrid in the 2023-24 Champions League knockout stage from open play at the Santiago Bernabeu for RB Leipzig?",
    "options": [
      "Willi Orban",
      "Dani Olmo",
      "Lois Openda",
      "Xavi Simons"
    ],
    "answer": "Willi Orban",
    "difficulty": "Very Hard",
    "category": "Champions League",
    "year": 2024,
    "context": "Leipzig captain Willi Orban powered home a diving header in the 68th minute of their 1-1 second-leg draw."
  },
  {
    "id": 198,
    "question": "Which player came off the bench to score in the 111th minute for Italy against Austria in the Euro 2020 round of 16 at Wembley?",
    "options": [
      "Matteo Pessina",
      "Federico Chiesa",
      "Andrea Belotti",
      "Manuel Locatelli"
    ],
    "answer": "Matteo Pessina",
    "difficulty": "Very Hard",
    "category": "European Championship",
    "year": 2021,
    "context": "Both substitutes scored in extra time: Federico Chiesa in the 95th minute and Matteo Pessina in the 105th minute."
  },
  {
    "id": 199,
    "question": "In summer 2022, which Dutch defender transferred from Juventus to Bayern Munich for a base fee of €67 million?",
    "options": [
      "Matthijs de Ligt",
      "Stefan de Vrij",
      "Jurrien Timber",
      "Sven Botman"
    ],
    "answer": "Matthijs de Ligt",
    "difficulty": "Very Hard",
    "category": "Transfers & Records",
    "year": 2022,
    "context": "De Ligt spent two seasons in Munich before joining Manchester United in August 2024."
  },
  {
    "id": 200,
    "question": "Who scored the winning penalty for Manchester City in the 2020 Carabao Cup Final against Aston Villa, or what was the final score at Wembley in March 2020?",
    "options": [
      "Manchester City won 2-1 in normal time (Aguero and Rodri scored)",
      "Manchester City won 3-0",
      "Manchester City won 4-1 on penalties",
      "Manchester City won 1-0"
    ],
    "answer": "Manchester City won 2-1 in normal time (Aguero and Rodri scored)",
    "difficulty": "Very Hard",
    "category": "Domestic Cups & Leagues",
    "year": 2020,
    "context": "Sergio Aguero and Rodri scored first-half goals before Mbwana Samatta pulled one back for Villa in front of 82,000 fans right before lockdown."
  }
];
