/* ============================================================
   InkTrail — data layer
   Simulated backend using localStorage. Swap this file for real
   API calls later; every other script only talks to `DB`.
============================================================ */

const DB = (() => {
  const USERS_KEY = "inktrail_users";
  const POSTS_KEY = "inktrail_posts";
  const SESSION_KEY = "inktrail_session";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedIfEmpty() {
    if (!localStorage.getItem(USERS_KEY)) {
      const demoUser = {
        id: "u_demo",
        name: "Demo Author",
        email: "demo@inktrail.dev",
        password: "demo1234",
        joined: Date.now() - 1000 * 60 * 60 * 24 * 40,
        bio: "Writing about frontend craft, one draft at a time.",
      };
      write(USERS_KEY, [demoUser]);
    }
    if (!localStorage.getItem(POSTS_KEY)) {
      const now = Date.now();
      const seed = [
        {
          id: "p1",
          authorId: "u_demo",
          authorName: "Demo Author",
          title: "Setting Up a Local Dev Environment That Doesn't Fight You",
          tags: ["setup", "tooling"],
          content:
            "# Getting Started\n\nEvery project starts the same way: a fresh folder and too many tabs open.\n\nHere's the checklist I run through every time —\n\n- Install **Node.js** LTS, not the bleeding edge\n- Pick an editor and *actually* learn its shortcuts\n- Set up a `.gitignore` before your first commit, not after\n\nThe goal isn't a perfect setup. It's a setup you stop thinking about.",
          published: true,
          likes: 12,
          createdAt: now - 1000 * 60 * 60 * 24 * 6,
        },
        {
          id: "p2",
          authorId: "u_demo",
          authorName: "Demo Author",
          title: "HTML, CSS, JS: What Actually Belongs Where",
          tags: ["html", "css", "javascript"],
          content:
            "# Three Layers, One Job Each\n\nA common beginner mistake is letting one layer do another's job.\n\n**HTML** describes what something *is*. **CSS** describes how it *looks*. **JavaScript** describes how it *behaves*.\n\nWhen a button's styling lives in six inline `style` attributes, that's not a JS problem — it's a boundary problem.",
          published: true,
          likes: 27,
          createdAt: now - 1000 * 60 * 60 * 24 * 3,
        },
        {
          id: "p3",
          authorId: "u_demo",
          authorName: "Demo Author",
          title: "Designing a Responsive Blog Interface From Scratch",
          tags: ["design", "responsive"],
          content:
            "# Start From the Narrowest Screen\n\nDesigning desktop-first and squeezing it down later is how you end up with hidden nav bars nobody can find.\n\nInstead, build the *370px* layout first. Everything wider is addition, not subtraction.\n\nA responsive blog only needs three real breakpoints: phone, tablet, desktop. Resist the urge to add more.",
          published: true,
          likes: 19,
          createdAt: now - 1000 * 60 * 60 * 24,
        },
      ];
      write(POSTS_KEY, seed);
    }
  }

  seedIfEmpty();

  return {
    // ---- users ----
    getUsers: () => read(USERS_KEY, []),
    saveUsers: (u) => write(USERS_KEY, u),
    findUserByEmail(email) {
      return this.getUsers().find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    },
    createUser(user) {
      const users = this.getUsers();
      users.push(user);
      this.saveUsers(users);
    },

    // ---- session ----
    getSession: () => read(SESSION_KEY, null),
    setSession: (userId) => write(SESSION_KEY, userId),
    clearSession: () => localStorage.removeItem(SESSION_KEY),
    currentUser() {
      const id = this.getSession();
      if (!id) return null;
      return this.getUsers().find((u) => u.id === id) || null;
    },

    // ---- posts ----
    getPosts: () => read(POSTS_KEY, []),
    savePosts: (p) => write(POSTS_KEY, p),
    getPublishedPosts() {
      return this.getPosts()
        .filter((p) => p.published)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    getPostsByAuthor(authorId) {
      return this.getPosts()
        .filter((p) => p.authorId === authorId)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    getPost(id) {
      return this.getPosts().find((p) => p.id === id);
    },
    createPost(post) {
      const posts = this.getPosts();
      posts.unshift(post);
      this.savePosts(posts);
    },
    updatePost(id, patch) {
      const posts = this.getPosts();
      const idx = posts.findIndex((p) => p.id === id);
      if (idx === -1) return;
      posts[idx] = { ...posts[idx], ...patch };
      this.savePosts(posts);
    },
    deletePost(id) {
      this.savePosts(this.getPosts().filter((p) => p.id !== id));
    },
    toggleLike(id) {
      const likedKey = "inktrail_liked";
      const liked = read(likedKey, []);
      const has = liked.includes(id);
      const posts = this.getPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) return;
      post.likes += has ? -1 : 1;
      write(likedKey, has ? liked.filter((x) => x !== id) : [...liked, id]);
      this.savePosts(posts);
      return !has;
    },
    isLiked(id) {
      return read("inktrail_liked", []).includes(id);
    },
  };
})();
