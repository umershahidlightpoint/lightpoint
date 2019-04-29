// import * as moment from "moment";

// interface data {
//   _id: string;
//   image: string;
//   video: string;
//   text: string;
//   iframe: string;
//   status: string;
//   type: string;
//   create_date: string;
//   user: {
//     _id: string;
//     first_name: string;
//     last_name: string;
//   };
// }

// interface user {
//   _id: string;
//   image: string;
//   video: string;
//   text: string;
//   iframe: string;
//   status: string;
//   type: string;
//   createDate: string;
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     name: string;
//   };
// }

// export class UserMapper {
//   public map(array: Array<object>): Array<object> {
//     const arrayList: Array<object> = array.map(
//       (element: data): user => this.mapUser(element)
//     );

//     return arrayList;
//   }

//   private mapUser(data: data): user {
//     return {
//       _id: data._id || null,
//       image: data.image || null,
//       video: data.video || null,
//       text: data.text || null,
//       iframe: data.iframe || null,
//       status: data.status || null,
//       type: data.type || null,
//       createDate: moment(data.create_date).fromNow() || null,
//       user: {
//         _id: data.user._id || null,
//         firstName: data.user.first_name || null,
//         lastName: data.user.last_name || null,
//         name: `${data.user.first_name} ${data.user.last_name}`
//       }
//     };
//   }
// }
