export interface Account {
    uid: string,
    name: string,
    username: string,
    description?: string,
    email: string,
    phone: string,
    photoURL: string,
    coverPhotoURL?: string,
    following?: Object,
    followers?: Object,
    friends?:  Object,
    bookmark?: Object

  }
  