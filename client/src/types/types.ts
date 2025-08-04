export type Actor = {
    _id: string;
    id: string;
    type: 'Person';
    preferredUsername: string;
    name: string;
    inbox: string;
    outbox: string;
    followers: number;
    following: number;
    icon: {
        id: string;
        type: 'Image';
        attributedTo: string;
        to: string[];
        url: string;
        published: string; // ISO 8601 datetime string
        createdAt: string; // ISO 8601 datetime string
        updatedAt: string; // ISO 8601 datetime string
    };
    createdAt: string; // ISO 8601 datetime string
    updatedAt: string; // ISO 8601 datetime string
    posts: number;
};