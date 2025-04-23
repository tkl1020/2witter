import tkinter as tk
from tkinter import simpledialog, messagebox

# A very basic social media app using tkinter.
# Modeled after a simple version of 2018-era Twitter: users can sign up, log in, and post.

class SocialApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Mini Social Media App")
        self.users = {}  # Dictionary to store user accounts: {username: password}
        self.posts = []  # List to store posts in format (username, post_text)
        self.current_user = None  # Track who is currently logged in
        self.build_login_screen()

    def build_login_screen(self):
        # Clear the window for a fresh screen
        for widget in self.root.winfo_children():
            widget.destroy()

        tk.Label(self.root, text="Welcome to the Mini Social App", font=("Arial", 16)).pack(pady=10)

        tk.Button(self.root, text="Log In", width=20, command=self.login).pack(pady=5)
        tk.Button(self.root, text="Sign Up", width=20, command=self.sign_up).pack(pady=5)

    def sign_up(self):
        username = simpledialog.askstring("Sign Up", "Choose a username:")
        if username in self.users:
            messagebox.showerror("Error", "Username already exists.")
            return
        password = simpledialog.askstring("Sign Up", "Choose a password:", show='*')
        self.users[username] = password
        messagebox.showinfo("Success", "Account created. You can now log in.")

    def login(self):
        username = simpledialog.askstring("Login", "Username:")
        password = simpledialog.askstring("Login", "Password:", show='*')
        if self.users.get(username) == password:
            self.current_user = username
            self.build_feed()
        else:
            messagebox.showerror("Login Failed", "Invalid username or password.")

    def build_feed(self):
        for widget in self.root.winfo_children():
            widget.destroy()

        tk.Label(self.root, text=f"Logged in as: {self.current_user}", font=("Arial", 12)).pack(pady=5)
        tk.Button(self.root, text="New Post", command=self.new_post).pack(pady=5)
        tk.Button(self.root, text="Log Out", command=self.logout).pack(pady=5)

        self.feed_box = tk.Text(self.root, height=15, width=50)
        self.feed_box.pack(pady=10)
        self.feed_box.insert(tk.END, self.format_posts())
        self.feed_box.config(state=tk.DISABLED)

    def new_post(self):
        post_text = simpledialog.askstring("New Post", "What's happening?")
        if post_text:
            self.posts.append((self.current_user, post_text))
            self.feed_box.config(state=tk.NORMAL)
            self.feed_box.delete(1.0, tk.END)
            self.feed_box.insert(tk.END, self.format_posts())
            self.feed_box.config(state=tk.DISABLED)

    def logout(self):
        self.current_user = None
        self.build_login_screen()

    def format_posts(self):
        # Format the post feed from newest to oldest
        formatted = "\n".join([f"@{user}: {text}" for user, text in reversed(self.posts)])
        return formatted or "No posts yet."

if __name__ == "__main__":
    root = tk.Tk()
    app = SocialApp(root)
    root.mainloop()
