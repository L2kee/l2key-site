import { BLOG_POSTS } from "./blog";

export const POSTS_PER_PAGE = 4;

export function getTotalPages() {
  return Math.max(1, Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE));
}

export function getPostsForPage(page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return BLOG_POSTS.slice(start, start + POSTS_PER_PAGE);
}
