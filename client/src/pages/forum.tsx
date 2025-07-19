import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ForumPostDetail } from "@/components/forum/forum-post-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Plus, Pin, Lock, User, Calendar, Search, Filter, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  content: z.string().min(1, "Content is required").max(5000, "Content must be 5000 characters or less"),
  category: z.string().min(1, "Category is required"),
});

type PostForm = z.infer<typeof postSchema>;

const FORUM_CATEGORIES = [
  "General Discussion",
  "Educational Resources",
  "Career Advice",
  "Study Tips",
  "Success Stories",
  "Questions & Help",
  "Announcements",
  "Off Topic"
];

export function Forum() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  const createPostForm = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const editPostForm = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  // Fetch forum posts
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", search, selectedCategory, sortBy, sortOrder, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: search || "",
        category: selectedCategory || "",
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: "20"
      });
      
      const response = await fetch(`/api/forum/posts?${params}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      return response.json();
    },
    enabled: !!user,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      return apiRequest("POST", "/api/forum/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setShowCreatePost(false);
      createPostForm.reset();
      toast({
        title: "Success",
        description: "Your post has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  // Edit post mutation
  const editPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PostForm }) => {
      return apiRequest("PUT", `/api/forum/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setEditingPost(null);
      editPostForm.reset();
      toast({
        title: "Success",
        description: "Your post has been updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/forum/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Post has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = async (data: PostForm) => {
    createPostMutation.mutate(data);
  };

  const handleEditPost = async (data: PostForm) => {
    if (editingPost) {
      editPostMutation.mutate({ id: editingPost.id, data });
    }
  };

  const handleDeletePost = (post: any) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate(post.id);
    }
  };

  const startEditingPost = (post: any) => {
    setEditingPost(post);
    editPostForm.reset({
      title: post.title,
      content: post.content,
      category: post.category,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.ceil(totalPosts / 20);

  // Show post detail view
  if (selectedPostId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ForumPostDetail 
            postId={selectedPostId} 
            onBack={() => setSelectedPostId(null)} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Forum Access Required</h1>
            <p className="text-muted-foreground">Please log in to access the community forum.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
              <p className="text-muted-foreground">Connect with fellow learners and educators</p>
            </div>
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share your thoughts, questions, or knowledge with the community.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createPostForm}>
                  <form onSubmit={createPostForm.handleSubmit(handleCreatePost)} className="space-y-4">
                    <FormField
                      control={createPostForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FORUM_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createPostForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter post title..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createPostForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your thoughts..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createPostMutation.isPending}>
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <div className="flex gap-2">
              <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {FORUM_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Latest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="replies">Replies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {search || selectedCategory 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to start a discussion!"}
                </p>
                {!search && !selectedCategory && (
                  <Button onClick={() => setShowCreatePost(true)}>
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            posts.map((post: any) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isSticky && <Pin className="h-4 w-4 text-blue-600" />}
                        {post.isLocked && <Lock className="h-4 w-4 text-gray-600" />}
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <CardTitle 
                        className="text-lg hover:text-blue-600 cursor-pointer"
                        onClick={() => setSelectedPostId(post.id)}
                      >
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {post.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.authorProfileImageUrl} />
                          <AvatarFallback>
                            {post.authorFirstName?.[0]}{post.authorLastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.authorFirstName} {post.authorLastName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replyCount} replies</span>
                      </div>
                      {(user?.id === post.userId || isAdmin) && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingPost(post)}
                            className="h-6 px-2 text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post)}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Edit Post Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Make changes to your forum post</DialogDescription>
          </DialogHeader>
          <Form {...editPostForm}>
            <form onSubmit={editPostForm.handleSubmit(handleEditPost)} className="space-y-4">
              <FormField
                control={editPostForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FORUM_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editPostForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editPostForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your thoughts..." 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingPost(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editPostMutation.isPending}>
                  {editPostMutation.isPending ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <ForumPostDetail 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}

      <Footer />
    </div>
  );
}