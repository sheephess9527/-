import type { Post } from './types';

declare module 'virtual:posts-meta' {
  const posts: Omit<Post, 'content'>[];
  export default posts;
}
