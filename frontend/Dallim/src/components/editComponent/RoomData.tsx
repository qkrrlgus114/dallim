export type RoomType = {
  Room: any;
  Theme: any;
}

export const backgroundImage = {
  image: require('../../assets/images/MainBackground3.png')
};

export const roomData: RoomType[] = [
  {
    Room: require('../../assets/Theme/RoomSample_1.png'),
    Theme: require('../../assets/Theme/ThemeSample_1.png')
  },
  {
    Room: require('../../assets/Theme/RoomSample_2.png'),
    Theme: require('../../assets/Theme/ThemeSample_2.png')
  },
  {
    Room: require('../../assets/Theme/RoomSample_3.png'),
    Theme: require('../../assets/Theme/ThemeSample_3.png')
  },
];
