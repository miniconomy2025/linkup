import { ActivityObject } from "../types/activitypub";

export function mapToActivityObject(data: any): ActivityObject {
  const type = data?.attachment?.type || data?.type;

  switch (type) {
    case 'Image':
      return {
        type: 'Image',
        attributedTo: data.attributedTo,
        url: data.attachment?.url || data.url,
        name: data?.content || data.attachment?.name || data.name,
        id: data.id,
        to: data.to,
        published: data.published
      };
    case 'Video':
      return {
        type: 'Video',
        attributedTo: data.attributedTo,
        url: data.attachment?.url || data.url,
        name: data.attachment?.name || data.name,
        id: data.id,
        to: data.to,
        published: data.published
      };
    case 'Note':
    default:
      return {
        type: 'Note',
        attributedTo: data.attributedTo,
        content: data.content || '',
        id: data.id,
        to: data.to,
        published: data.published
      };
  }
}