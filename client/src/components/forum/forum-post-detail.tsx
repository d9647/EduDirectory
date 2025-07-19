import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Reply, Edit, Trash2, Pin, Lock, Calendar, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createReplySchema = z.object({
  content: z.string().min(1, "Reply content is required").max(2000, "Reply must be 2000 characters or less"),
});

type CreateReplyForm = z.infer<typeof createReplySchema>;

interface ForumPostDetailProps {
  postId: number;
  onBack: () => void;
}

export function ForumPostDetail({ postId, onBack }: ForumPostDetailProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replyForm = useForm<CreateReplyForm>({
    resolver: zodResolver(createReplySchema),
    defaultValues: {
      content: "",
    },
  });

  // Fetch post details
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: [`/api/forum/posts/${postId}`],
    enabled: !!postId && !isNaN(postId),
  });

  // Fetch replies
  const { data: replies, isLoading: repliesLoading } = useQuery({
    queryKey: [`/api/forum/posts/${postId}/replies`],
    enabled: !!postId && !isNaN(postId),
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (data: CreateReplyForm) => {
      return apiRequest(`/api/forum/posts/${postId}/replies`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum/posts/${postId}/replies`] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setShowReplyForm(false);
      replyForm.reset();
      toast({
        title: "Success",
        description: "Your reply has been posted!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/forum/posts/${postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Post has been deleted.",
      });
      onBack();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  // Delete reply mutation
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      return apiRequest(`/api/forum/replies/${replyId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum/posts/${postId}/replies`] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Reply has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete reply",
        variant: "destructive",
      });
    },
  });

  const handleCreateReply = async (data: CreateReplyForm) => {
    createReplyMutation.mutate(data);
  };

  const handleDeletePost = () => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate();
    }
  };

  const handleDeleteReply = (replyId: number) => {
    if (confirm("Are you sure you want to delete this reply? This action cannot be undone.")) {
      deleteReplyMutation.mutate(replyId);
    }
  };

  const canEditPost = user && post && (user.id === post.userId || user.role === 'admin');
  const canDeletePost = user && post && (user.id === post.userId || user.role === 'admin');

  if (postLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Post not found.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Button>

      {/* Post */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {post.isSticky && <Pin className="h-4 w-4 text-blue-600" />}
                {post.isLocked && <Lock className="h-4 w-4 text-gray-600" />}
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </div>
            {canDeletePost && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeletePost}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </div>
            
            <Separator />
            
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
              
              {!post.isLocked && (
                <Dialog open={showReplyForm} onOpenChange={setShowReplyForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reply to Post</DialogTitle>
                      <DialogDescription>
                        Share your thoughts on this discussion.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...replyForm}>
                      <form onSubmit={replyForm.handleSubmit(handleCreateReply)} className="space-y-4">
                        <FormField
                          control={replyForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reply</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write your reply..." 
                                  className="min-h-[100px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => setShowReplyForm(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createReplyMutation.isPending}>
                            {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-lg font-semibold">
            Replies ({replies?.length || 0})
          </h3>
        </div>

        {repliesLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm">Loading replies...</p>
          </div>
        ) : replies && replies.length > 0 ? (
          replies.map((reply: any) => {
            const canDeleteReply = user && (user.id === reply.userId || user.role === 'admin');
            
            return (
              <Card key={reply.id} className="ml-4">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {reply.content}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={reply.authorProfileImageUrl} />
                            <AvatarFallback>
                              {reply.authorFirstName?.[0]}{reply.authorLastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{reply.authorFirstName} {reply.authorLastName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      {canDeleteReply && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground">No replies yet.</p>
              {!post.isLocked && (
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to reply to this post!
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}