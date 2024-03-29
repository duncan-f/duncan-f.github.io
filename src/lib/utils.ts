export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "");
}

export function classify(str: string) {
  return str.replace(
    /[a-z][a-z]*-?/g,
    ([f, ...rest]) => f.toUpperCase() + rest.join("").replace("-", " ")
  );
}

export function dateFormat(date: Date) {
  return new Date(date).toLocaleDateString("en-us", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatContent(
  posts: any,
  {
    filterOutFuturePosts = true,
    filterOutDrafts = true,
    sortByDate = true,
    limit = undefined,
  } = {}
) {
  const filteredPosts = posts.reduce((acc: any, post: any) => {
    const { date, draft } = post.data;
    // filterOutDrafts if true
    if (filterOutDrafts && draft && !import.meta.env.DEV) return acc;

    // filterOutFuturePosts if true
    if (filterOutFuturePosts && new Date(date) > new Date()) return acc;

    // add post to acc
    acc.push(post);

    return acc;
  }, []);

  // sortByDate or randomize
  if (sortByDate) {
    filteredPosts.sort(
      (a: any, b: any) => new Date(b.data.date) - new Date(a.data.date)
    );
  } else {
    filteredPosts.sort(() => Math.random() - 0.5);
  }

  // limit if number is passed
  if (typeof limit === "number") {
    return filteredPosts.slice(0, limit);
  }
  return filteredPosts;
}
