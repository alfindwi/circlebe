import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// // class SuggestionService {
// //   async getSuggestions(userId: number) {
// //     // Cari pengguna yang belum diikuti oleh userId
// //     const suggestions = await prisma.user.findMany({
// //       where: {
// //         id: { not: userId },
// //         AND: {
// //           followers: { none: { followerId: userId } },
// //         },
// //       },
// //       select: {
// //         id: true,
// //         username: true,
// //         fullName: true,
// //         image: true,
// //       },
// //       take: 5, // ambil 5 pengguna teratas untuk disarankan
// //     });

// //     return suggestions;
// //   }
// // }

// export default new SuggestionService();
