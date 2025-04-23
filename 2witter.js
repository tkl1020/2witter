// 2witter - Robust, Modular, and Commented Version
// A secure, maintainable Twitter-style social media app in React

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Default avatar for users who do not provide one
const DEFAULT_PIC = "https://placekitten.com/100/100";

export default function SocialApp() {
  // All registered users stored as { username: { password, picture, bio } }
  const [users, setUsers] = useState({});

  // Logged-in user state
  const [user, setUser] = useState(null);

  // Toggle between login and signup mode
  const [isSignup, setIsSignup] = useState(false);

  // Form state for login/signup fields
  const [form, setForm] = useState({ username: "", password: "", bio: "", picture: "" });

  // Post management states
  const [posts, setPosts] = useState([]); // All posts in the feed
  const [newPost, setNewPost] = useState(""); // Text content for a new post
  const [filter, setFilter] = useState("newest"); // Feed sorting preference

  // Handles both signup and login logic
  const handleAuth = () => {
    const { username, password, bio, picture } = form;

    if (!username.trim() || !password.trim()) {
      alert("Both username and password are required.");
      return;
    }

    if (isSignup) {
      // Prevent duplicate usernames
      if (users.hasOwnProperty(username)) {
        alert("Username already exists. Choose another.");
        return;
      }

      // Add new user to state
      setUsers(prev => ({
        ...prev,
        [username]: {
          password,
          bio: bio.trim(),
          picture: picture.trim() || DEFAULT_PIC
        }
      }));

      alert("Signup successful!");
      setIsSignup(false);
      setForm({ username: "", password: "", bio: "", picture: "" });
    } else {
      // Login validation
      const existingUser = users[username];
      if (!existingUser || existingUser.password !== password) {
        alert("Invalid username or password.");
        return;
      }

      // Login success
      setUser({ username, ...existingUser });
    }
  };

  // Clears user session
  const handleLogout = () => setUser(null);

  // Posts a new entry to the feed
  const handlePost = (image = null) => {
    if (!newPost.trim() && !image) return;

    const post = {
      id: crypto.randomUUID(), // Unique ID for this post
      user: user.username, // Username of the poster
      text: newPost.trim(), // Text content
      timestamp: new Date(), // Timestamp for sorting
      likes: 0, // Initial like count
      replies: [], // Array of reply objects
      image: image || null // Optional image
    };

    setPosts(prev => [post, ...prev]);
    setNewPost(""); // Clear post input
  };

  // Increments the like count of a post
  const handleLike = id => {
    setPosts(prev => prev.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Adds a reply to a post
  const handleReply = id => {
    const replyText = prompt("Your reply:");
    if (!replyText?.trim()) return;

    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, replies: [...post.replies, { user: user.username, text: replyText.trim() }] }
        : post
    ));
  };

  // Sort posts based on selected filter
  const sortedPosts = [...posts].sort((a, b) =>
    filter === "newest"
      ? b.timestamp - a.timestamp
      : b.likes - a.likes
  );

  // --- AUTH UI RENDER ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">{isSignup ? "Sign Up" : "Log In"}</h1>

          {/* Username input */}
          <Input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="mb-3"
          />

          {/* Password input */}
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="mb-3"
          />

          {/* Extra inputs for signup mode */}
          {isSignup && (
            <>
              <Input
                placeholder="Profile Picture URL (optional)"
                value={form.picture}
                onChange={e => setForm({ ...form, picture: e.target.value })}
                className="mb-3"
              />
              <Textarea
                placeholder="Bio"
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className="mb-3"
              />
            </>
          )}

          {/* Submit button */}
          <Button className="w-full mb-2" onClick={handleAuth}>
            {isSignup ? "Sign Up" : "Log In"}
          </Button>

          {/* Toggle between login and signup */}
          <Button variant="ghost" className="w-full" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Have an account? Log in" : "New? Sign up here"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- MAIN UI RENDER ---
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with profile and settings */}
      <aside className="w-64 p-4 border-r border-gray-300">
        <div className="text-lg font-bold mb-4">@{user.username}</div>
        <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
        <p className="text-sm text-gray-600 mb-4">{user.bio}</p>

        {/* Logout button */}
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Log Out
        </Button>

        {/* Feed sorting */}
        <hr className="my-4" />
        <h4 className="text-sm font-medium mb-2">Sort feed by:</h4>
        <Button variant={filter === "newest" ? "default" : "ghost"} onClick={() => setFilter("newest")} className="w-full mb-1">
          Newest
        </Button>
        <Button variant={filter === "popular" ? "default" : "ghost"} onClick={() => setFilter("popular")} className="w-full">
          Most Liked
        </Button>
      </aside>

      {/* Main feed content */}
      <main className="flex-1 p-6">
        {/* Post composer */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Textarea
              placeholder="What's happening?"
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-3">
              <Button onClick={() => handlePost()}>Post</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const url = prompt("Enter image or gif URL:");
                  if (url?.trim()) handlePost(url.trim());
                }}
              >📷 Add Image/GIF</Button>
            </div>
          </CardContent>
        </Card>

        {/* Post feed */}
        <ScrollArea className="h-[600px] rounded-xl border bg-white">
          <div className="p-4 space-y-4">
            {sortedPosts.length === 0 ? (
              <p className="text-gray-500 text-center">No posts yet.</p>
            ) : (
              sortedPosts.map(post => (
                <Card key={post.id} className="shadow-md">
                  <CardContent className="p-4">
                    {/* Post header */}
                    <div className="flex items-center gap-3">
                      <img src={users[post.user]?.picture || DEFAULT_PIC} className="w-10 h-10 rounded-full" alt="avatar" />
                      <div>
                        <p className="font-semibold">@{post.user}</p>
                        <p className="text-sm text-gray-500">{post.timestamp.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Post content */}
                    <p className="mt-2">{post.text}</p>
                    {post.image && (
                      <img src={post.image} alt="post attachment" className="mt-2 max-h-60 rounded-lg" />
                    )}

                    {/* Post actions */}
                    <div className="flex gap-3 mt-3">
                      <Button size="sm" variant="ghost" onClick={() => handleLike(post.id)}>❤️ {post.likes}</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReply(post.id)}>💬 {post.replies.length}</Button>
                    </div>

                    {/* Post replies */}
                    {post.replies.length > 0 && (
                      <div className="mt-3 ml-4 border-l pl-4">
                        {post.replies.map((r, i) => (
                          <p key={i}><strong>@{r.user}</strong>: {r.text}</p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
