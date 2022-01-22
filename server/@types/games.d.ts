export type TPlatform = "PC" | "Switch" | "Xbox";

export interface IGames {
  name: string;
  platform: TPlatform;
  completed: string;
  bought: string;
  price: number;
  minImage: string;
  maxImage: string;
}

interface INotionDate {
  start: string;
}

export interface INotionGamePage {
  properties: {
    Price: {
      number: number;
    };
    Type: {
      select: {
        name: string;
      };
    };
    Completed: {
      date: INotionDate | null;
    };
    Platform: {
      select: {
        name: string;
      };
    };
    Bought: {
      date: INotionDate | null;
    };
    Name: {
      title: {
        text: {
          content: string;
        };
      }[];
    };
  };
}

export interface IGameImages {
  [key: string]: {
    minImage: string;
    maxImage: string;
  };
}