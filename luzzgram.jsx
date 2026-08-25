import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Search, Home, Plus, User, LogOut, Settings } from 'lucide-react';

const LUZZGRAM = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google Sign-In Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Google Sign-In when script is loaded
  useEffect(() => {
    if (googleLoaded && window.google && currentPage === 'login') {
      window.google.accounts.id.initialize({
        client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
        callback: handleGoogleLogin,
        auto_select: false
      });
      
      const container = document.getElementById('google-signin-button');
      if (container && !container.hasChildNodes()) {
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: '100%'
        });
      }
    }
  }, [googleLoaded, currentPage]);

  // Handle Google Login
  const handleGoogleLogin = (response) => {
    try {
      // Decode JWT token manually (simple decode, tidak verify signature)
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Extract user info from Google token
      const googleEmail = payload.email;
      const googleName = payload.name;
      const googlePicture = payload.picture;
      
      // Check if user exists
      let existingUser = users.find(u => u.email === googleEmail);
      
      if (existingUser) {
        // Login existing user
        setCurrentUser(existingUser);
        localStorage.setItem('luzzgram_currentUser', JSON.stringify(existingUser));
      } else {
        // Create new user from Google data
        const username = googleName.toLowerCase().replace(/\s+/g, '_');
        const newUser = {
          id: users.length + 1,
          username: username,
          fullName: googleName,
          email: googleEmail,
          password: '', // No password for Google users
          bio: '📱 Joined via Google',
          avatar: googlePicture ? '🌐' : '👤', // Use globe emoji since we can't load external images
          picture: googlePicture,
          googleUser: true,
          followers: [],
          following: []
        };
        
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setCurrentUser(newUser);
        localStorage.setItem('luzzgram_users', JSON.stringify(updatedUsers));
        localStorage.setItem('luzzgram_currentUser', JSON.stringify(newUser));
      }
      
      setCurrentPage('feed');
    } catch (error) {
      console.error('Error processing Google login:', error);
      alert('Gagal login dengan Google. Silakan coba lagi.');
    }
  };

  // Load data from localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('luzzgram_users') || '[]');
    const savedPosts = JSON.parse(localStorage.getItem('luzzgram_posts') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('luzzgram_currentUser') || 'null');

    if (savedUsers.length === 0) {
      initializeSampleData();
    } else {
      setUsers(savedUsers);
      setPosts(savedPosts);
      setCurrentUser(savedCurrentUser);
    }
  }, []);

  // Initialize sample data
  const initializeSampleData = () => {
    const sampleUsers = [
      {
        id: 1,
        username: 'luzzhq',
        fullName: 'Luzz Official',
        email: 'luzz@luzzgram.com',
        password: '123456',
        bio: 'The official LUZZGRAM account 🚀',
        avatar: '👑',
        followers: ['2', '3'],
        following: ['2']
      },
      {
        id: 2,
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        bio: 'Photography enthusiast 📸',
        avatar: '🧑‍🦱',
        followers: ['1', '3'],
        following: ['1', '3']
      },
      {
        id: 3,
        username: 'sarahsmith',
        fullName: 'Sarah Smith',
        email: 'sarah@example.com',
        password: '123456',
        bio: 'Designer & Coffee lover ☕',
        avatar: '👩‍🦰',
        followers: ['1', '2'],
        following: ['1', '2']
      }
    ];

    const samplePosts = [
      {
        id: 1,
        userId: 1,
        username: 'luzzhq',
        avatar: '👑',
        caption: 'Welcome to LUZZGRAM! The best social platform 🎉',
        image: '🌟',
        timestamp: new Date().getTime() - 3600000,
        likes: ['2', '3'],
        comments: [
          { userId: '2', username: 'johndoe', text: 'Amazing! 🔥' },
          { userId: '3', username: 'sarahsmith', text: 'Love this!' }
        ]
      },
      {
        id: 2,
        userId: 2,
        username: 'johndoe',
        avatar: '🧑‍🦱',
        caption: 'Beautiful sunset at the beach 🌅',
        image: '🏖️',
        timestamp: new Date().getTime() - 7200000,
        likes: ['1', '3'],
        comments: [
          { userId: '1', username: 'luzzhq', text: 'Stunning shot!' }
        ]
      },
      {
        id: 3,
        userId: 3,
        username: 'sarahsmith',
        avatar: '👩‍🦰',
        caption: 'Coffee and design, the perfect combination ☕✨',
        image: '☕',
        timestamp: new Date().getTime() - 10800000,
        likes: ['1', '2'],
        comments: [
          { userId: '2', username: 'johndoe', text: 'Looks delicious!' }
        ]
      }
    ];

    setUsers(sampleUsers);
    setPosts(samplePosts);
    localStorage.setItem('luzzgram_users', JSON.stringify(sampleUsers));
    localStorage.setItem('luzzgram_posts', JSON.stringify(samplePosts));
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('luzzgram_currentUser', JSON.stringify(user));
      setLoginEmail('');
      setLoginPassword('');
      setCurrentPage('feed');
    } else {
      alert('Email atau password salah!');
    }
  };

  // Handle Register
  const handleRegister = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === registerEmail)) {
      alert('Email sudah terdaftar!');
      return;
    }
    const newUser = {
      id: users.length + 1,
      username: registerUsername,
      fullName: registerFullName,
      email: registerEmail,
      password: registerPassword,
      bio: '',
      avatar: '👤',
      followers: [],
      following: []
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('luzzgram_users', JSON.stringify(updatedUsers));
    localStorage.setItem('luzzgram_currentUser', JSON.stringify(newUser));
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterUsername('');
    setRegisterFullName('');
    setCurrentPage('feed');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('luzzgram_currentUser');
    setCurrentPage('feed');
  };

  // Create Post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostCaption.trim() || !newPostImage.trim()) {
      alert('Caption dan emoji tidak boleh kosong!');
      return;
    }
    const newPost = {
      id: posts.length + 1,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      caption: newPostCaption,
      image: newPostImage,
      timestamp: new Date().getTime(),
      likes: [],
      comments: []
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('luzzgram_posts', JSON.stringify(updatedPosts));
    setNewPostCaption('');
    setNewPostImage('');
    setCurrentPage('feed');
  };

  // Like Post
  const toggleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(String(currentUser.id))
          ? post.likes.filter(id => id !== String(currentUser.id))
          : [...post.likes, String(currentUser.id)];
        return { ...post, likes };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('luzzgram_posts', JSON.stringify(updatedPosts));
  };

  // Add Comment
  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { userId: String(currentUser.id), username: currentUser.username, text: commentText }
          ]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('luzzgram_posts', JSON.stringify(updatedPosts));
  };

  // Follow User
  const toggleFollow = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          following: user.following.includes(String(userId))
            ? user.following.filter(id => id !== String(userId))
            : [...user.following, String(userId)]
        };
      }
      if (user.id === userId) {
        return {
          ...user,
          followers: user.followers.includes(String(currentUser.id))
            ? user.followers.filter(id => id !== String(currentUser.id))
            : [...user.followers, String(currentUser.id)]
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    localStorage.setItem('luzzgram_users', JSON.stringify(updatedUsers));
    localStorage.setItem('luzzgram_currentUser', JSON.stringify(updatedUsers.find(u => u.id === currentUser.id)));
  };

  // Get feed posts
  const getFeedPosts = () => {
    return posts
      .filter(post => currentUser.following.includes(String(post.userId)) || post.userId === currentUser.id)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  // Search users
  const searchedUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LOGIN PAGE
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LUZZGRAM
            </h1>
            <p className="text-center text-gray-600 mb-8">Bagikan momen terbaik Anda</p>

            {currentPage === 'login' ? (
              <div className="space-y-6">
                {/* Google Sign-In Button */}
                <div>
                  <div id="google-signin-button" className="w-full"></div>
                  <style>{`
                    #google-signin-button {
                      display: flex;
                      justify-content: center;
                    }
                  `}</style>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">ATAU</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    Login
                  </button>
                </form>

                {/* Demo Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-700 font-semibold mb-2">🧪 DEMO ACCOUNT</p>
                  <p className="text-xs text-blue-600">Email: luzz@luzzgram.com</p>
                  <p className="text-xs text-blue-600">Password: 123456</p>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Google Sign-In Button for Register */}
                <div>
                  <p className="text-center text-sm text-gray-600 mb-4">Atau daftar dengan Google:</p>
                  <div id="google-signin-button" className="w-full"></div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm">ATAU</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    Daftar
                  </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600">
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    Login di sini
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setCurrentPage('feed')}>
            LUZZGRAM
          </h1>
          
          {/* Navigation */}
          <div className="flex gap-6 items-center">
            <button onClick={() => setCurrentPage('feed')} className={`flex items-center gap-2 ${currentPage === 'feed' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>
              <Home size={24} />
            </button>
            <button onClick={() => setCurrentPage('explore')} className={`flex items-center gap-2 ${currentPage === 'explore' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>
              <Search size={24} />
            </button>
            <button onClick={() => setCurrentPage('create')} className={`flex items-center gap-2 ${currentPage === 'create' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>
              <Plus size={24} />
            </button>
            <button onClick={() => setCurrentPage('profile')} className={`flex items-center gap-2 ${currentPage === 'profile' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>
              <User size={24} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* FEED PAGE */}
        {currentPage === 'feed' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {getFeedPosts().map(post => {
                const [commentText, setCommentText] = useState('');
                const postUser = users.find(u => u.id === post.userId);
                return (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                      <div className="text-3xl cursor-pointer" onClick={() => {
                        setSelectedUser(postUser);
                        setCurrentPage('user-profile');
                      }}>
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm cursor-pointer hover:text-purple-600" onClick={() => {
                          setSelectedUser(postUser);
                          setCurrentPage('user-profile');
                        }}>
                          {post.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="bg-gray-100 text-6xl flex items-center justify-center py-32">
                      {post.image}
                    </div>

                    {/* Post Actions */}
                    <div className="p-4">
                      <div className="flex gap-4 mb-3">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 transition ${
                            post.likes.includes(String(currentUser.id))
                              ? 'text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart size={24} fill={post.likes.includes(String(currentUser.id)) ? 'currentColor' : 'none'} />
                          <span className="text-sm">{post.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
                          <MessageCircle size={24} />
                          <span className="text-sm">{post.comments.length}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition">
                          <Share2 size={24} />
                        </button>
                      </div>

                      {/* Caption */}
                      <p className="text-sm mb-3">
                        <span className="font-semibold">{post.username}</span> {post.caption}
                      </p>

                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                          {post.comments.map((comment, idx) => (
                            <p key={idx} className="text-sm">
                              <span className="font-semibold">{comment.username}</span> {comment.text}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex gap-2 border-t border-gray-200 pt-3">
                        <input
                          type="text"
                          placeholder="Tambahkan komentar..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id, commentText);
                              setCommentText('');
                            }
                          }}
                          className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                          onClick={() => {
                            addComment(post.id, commentText);
                            setCommentText('');
                          }}
                          className="text-purple-600 font-semibold text-sm hover:text-purple-700"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar - Suggested Users */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Saran Untuk Anda</h2>
                <div className="space-y-4">
                  {users
                    .filter(u => u.id !== currentUser.id && !currentUser.following.includes(String(u.id)))
                    .slice(0, 5)
                    .map(user => (
                      <div key={user.id} className="flex items-center gap-3">
                        <div className="text-3xl">{user.avatar}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm cursor-pointer hover:text-purple-600" onClick={() => {
                            setSelectedUser(user);
                            setCurrentPage('user-profile');
                          }}>
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500">{user.followers.length} pengikut</p>
                        </div>
                        <button
                          onClick={() => toggleFollow(user.id)}
                          className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-purple-700 transition"
                        >
                          Ikuti
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPLORE PAGE */}
        {currentPage === 'explore' && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {searchedUsers.map(user => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition transform hover:scale-105"
                  onClick={() => {
                    setSelectedUser(user);
                    setCurrentPage('user-profile');
                  }}
                >
                  <div className="text-6xl mb-4">{user.avatar}</div>
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-gray-600 text-sm mb-4">@{user.username}</p>
                  <p className="text-sm mb-4 text-gray-700">{user.bio}</p>
                  <div className="flex justify-around text-sm mb-4">
                    <div>
                      <p className="font-semibold">{posts.filter(p => p.userId === user.id).length}</p>
                      <p className="text-gray-600">Posts</p>
                    </div>
                    <div>
                      <p className="font-semibold">{user.followers.length}</p>
                      <p className="text-gray-600">Pengikut</p>
                    </div>
                    <div>
                      <p className="font-semibold">{user.following.length}</p>
                      <p className="text-gray-600">Mengikuti</p>
                    </div>
                  </div>
                  {currentUser.id !== user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        currentUser.following.includes(String(user.id))
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {currentUser.following.includes(String(user.id)) ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE POST PAGE */}
        {currentPage === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Buat Post Baru</h2>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Emoji (Pilih emoji untuk gambar)</label>
                  <input
                    type="text"
                    placeholder="Masukkan emoji (contoh: 🌅, 📸, 🎉)"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    maxLength="2"
                  />
                  <div className="mt-4 bg-gray-100 rounded-lg p-8 text-6xl flex items-center justify-center">
                    {newPostImage || '📷'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Keterangan</label>
                  <textarea
                    placeholder="Tulis keterangan untuk post Anda..."
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                    rows="5"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Bagikan Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('feed')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROFILE PAGE */}
        {currentPage === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-8xl">{currentUser.avatar}</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{currentUser.fullName}</h2>
                    <p className="text-xl text-gray-600">@{currentUser.username}</p>
                    <p className="text-gray-700 my-4">{currentUser.bio || 'Tidak ada bio'}</p>
                    <div className="flex gap-8 text-center">
                      <div>
                        <p className="text-2xl font-semibold">{posts.filter(p => p.userId === currentUser.id).length}</p>
                        <p className="text-gray-600">Posts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{currentUser.followers.length}</p>
                        <p className="text-gray-600">Pengikut</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{currentUser.following.length}</p>
                        <p className="text-gray-600">Mengikuti</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Posts */}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6">Posts Anda</h3>
                <div className="space-y-6">
                  {posts
                    .filter(p => p.userId === currentUser.id)
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(post => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="bg-gray-100 text-4xl flex items-center justify-center py-24 rounded-lg mb-4">
                          {post.image}
                        </div>
                        <p className="font-semibold mb-2">{post.caption}</p>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>❤️ {post.likes.length} likes</span>
                          <span>💬 {post.comments.length} comments</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER PROFILE PAGE */}
        {currentPage === 'user-profile' && selectedUser && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentPage('feed')}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              ← Kembali
            </button>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-8xl">{selectedUser.avatar}</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{selectedUser.fullName}</h2>
                    <p className="text-xl text-gray-600">@{selectedUser.username}</p>
                    <p className="text-gray-700 my-4">{selectedUser.bio || 'Tidak ada bio'}</p>
                    <div className="flex gap-8 text-center mb-4">
                      <div>
                        <p className="text-2xl font-semibold">{posts.filter(p => p.userId === selectedUser.id).length}</p>
                        <p className="text-gray-600">Posts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{selectedUser.followers.length}</p>
                        <p className="text-gray-600">Pengikut</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{selectedUser.following.length}</p>
                        <p className="text-gray-600">Mengikuti</p>
                      </div>
                    </div>
                    {currentUser.id !== selectedUser.id && (
                      <button
                        onClick={() => toggleFollow(selectedUser.id)}
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                          currentUser.following.includes(String(selectedUser.id))
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {currentUser.following.includes(String(selectedUser.id)) ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* User Posts */}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6">Posts dari {selectedUser.fullName}</h3>
                <div className="space-y-6">
                  {posts
                    .filter(p => p.userId === selectedUser.id)
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(post => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="bg-gray-100 text-4xl flex items-center justify-center py-24 rounded-lg mb-4">
                          {post.image}
                        </div>
                        <p className="font-semibold mb-2">{post.caption}</p>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>❤️ {post.likes.length} likes</span>
                          <span>💬 {post.comments.length} comments</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LUZZGRAM;