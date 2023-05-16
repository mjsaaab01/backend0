type TObjectId = {
  id: string;
};

// type TUser = {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
//   key: string;
//   isValid: boolean;
//   isVerified: boolean;
// };

enum ERole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  CLUB_ADMIN = 'student',
  SUPER_ADMIN = 'student',
}

export { TObjectId, ERole };
