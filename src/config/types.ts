export type Example = string;

export type Meaning = {
  definition: string;
  examples: Example[];
};

export type WordEntry = {
  translation: string;
  meanings: Meaning[];
};

export type Category = {
  [word: string]: WordEntry;
};

export type DictionaryType = {
  [category: string]: Category;
};

export const defaultDictionary : DictionaryType = {
    "No word": {
      "mission statement": {
        "meanings": [
          {
            "definition": "add some definition",
            "examples": [
              "add some examples"
            ]
          }
        ],
        "translation": "add some translation"
      },
      
    },
  }