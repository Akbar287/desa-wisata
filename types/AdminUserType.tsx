export interface AdminUserListItem {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    nationality: string;
    phoneCode: string;
    phoneNumber: string;
    address: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    UserRole: { id: number; roleId: number; role: { id: number; name: string } }[];
    _count?: { UserLogin: number };
}

export interface RoleItem {
    id: number;
    name: string;
    description: string | null;
}

export interface UserLoginItem {
    id: number;
    userId: number;
    Username: string;
    Password: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserFormData {
    name: string;
    email: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    nationality: string;
    phoneCode: string;
    phoneNumber: string;
    address: string;
    avatar: string;
}

export interface UserLoginFormData {
    Username: string;
    Password: string;
}

export interface RoleFormData {
    name: string;
    description: string;
}
