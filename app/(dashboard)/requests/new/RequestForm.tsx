"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { createServiceRequest } from "@/actions/serviceRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
};

type RequestActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: RequestActionState = { ok: false, message: "" };

function FieldError({ messages }: { messages?: string[] }) {
  return messages?.length ? <p className="text-xs font-medium text-red-700">{messages[0]}</p> : null;
}

export function RequestForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createServiceRequest, initialState);

  return (
    <form action={formAction} className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Leaking pipe in hostel bathroom" required />
        <FieldError messages={state.fieldErrors?.title} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Describe what happened, when it started, and any immediate risk." required />
        <FieldError messages={state.fieldErrors?.description} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" required>
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError messages={state.fieldErrors?.categoryId} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue="medium">
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <FieldError messages={state.fieldErrors?.priority} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="building">Building</Label>
          <Input id="building" name="building" placeholder="Science Block" required />
          <FieldError messages={state.fieldErrors?.building} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="roomOrArea">Room or area</Label>
          <Input id="roomOrArea" name="roomOrArea" placeholder="Room 204" required />
          <FieldError messages={state.fieldErrors?.roomOrArea} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="locationNotes">Location notes</Label>
        <Input id="locationNotes" name="locationNotes" placeholder="Nearest entrance or landmark" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="attachments">Evidence image URLs</Label>
        <Textarea id="attachments" name="attachments" placeholder="Upload integration adds Blob URLs here in the evidence chunk." className="min-h-20" />
      </div>
      {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="justify-self-start">
        <Send className="h-4 w-4" aria-hidden="true" />
        {pending ? "Submitting" : "Submit request"}
      </Button>
    </form>
  );
}
