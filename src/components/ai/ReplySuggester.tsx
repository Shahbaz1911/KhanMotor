"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SuggestReplyInput } from "@/ai/flows/suggest-reply";
import { generateAiReply } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Clipboard, Loader2 } from "lucide-react";

const replySuggesterSchema = z.object({
  inquiry: z.string().min(10, { message: "Inquiry must be at least 10 characters." }),
  tone: z.enum(["Friendly", "Professional", "Formal"]).optional().default("Professional"),
  detailLevel: z.enum(["Brief", "Detailed"]).optional().default("Detailed"),
});

type ReplySuggesterFormValues = z.infer<typeof replySuggesterSchema>;

const toneOptions = ["Friendly", "Professional", "Formal"];
const detailLevelOptions = ["Brief", "Detailed"];

export function ReplySuggester() {
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReplySuggesterFormValues>({
    resolver: zodResolver(replySuggesterSchema),
    defaultValues: {
      inquiry: "",
      tone: "Professional",
      detailLevel: "Detailed",
    },
  });

  async function onSubmit(values: ReplySuggesterFormValues) {
    setIsLoading(true);
    setSuggestedReply(null);

    const input: SuggestReplyInput = {
      inquiry: values.inquiry,
      tone: values.tone,
      detailLevel: values.detailLevel,
    };

    const result = await generateAiReply(input);

    setIsLoading(false);
    if (result.reply) {
      setSuggestedReply(result.reply);
      toast({
        title: "Reply Suggested",
        description: "AI has generated a reply suggestion.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to generate reply.",
        variant: "destructive",
      });
    }
  }

  const handleCopyToClipboard = () => {
    if (suggestedReply) {
      navigator.clipboard.writeText(suggestedReply)
        .then(() => {
          toast({ title: "Copied!", description: "Reply copied to clipboard." });
        })
        .catch(() => {
          toast({ title: "Error", description: "Failed to copy reply.", variant: "destructive" });
        });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-3xl font-headline">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Reply Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions for responding to user inquiries. Customize the tone and detail level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="inquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Inquiry</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the user's question or message here..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The original message from the user you need to reply to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toneOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level of Detail</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select detail level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {detailLevelOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Suggestion
            </Button>
          </form>
        </Form>
      </CardContent>

      {suggestedReply && (
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
            <h3 className="text-xl font-semibold">Suggested Reply:</h3>
            <Textarea
              value={suggestedReply}
              readOnly
              className="min-h-[150px] resize-none bg-muted/50"
              aria-label="Suggested reply"
            />
            <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
              <Clipboard className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
