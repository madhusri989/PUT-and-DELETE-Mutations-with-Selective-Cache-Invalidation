
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateThread, deleteThread } from "../services/threads.service";

export default function ThreadItem({ thread }) {
  const [title, setTitle] = useState(thread.title);
  const [editing, setEditing] = useState(false);

  // TODO: Get the query client.
  const queryClient = useQueryClient();

  // TODO: Create the edit mutation and invalidate both query keys.
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateThread(id, data),
    onSuccess: (updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
      setEditing(false);
    },
  });

  // TODO: Create the delete mutation and invalidate only the list.
  const deleteMutation = useMutation({
    mutationFn: deleteThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  function handleSave() {
    // TODO: Submit the updated title using the edit mutation.
    editMutation.mutate({
      id: thread.id,
      data: { title },
    });
  }

  function handleDelete() {
    // TODO: Delete the thread using the delete mutation.
    deleteMutation.mutate(thread.id);
  }

  if (editing) {
    return (
      <li className="card">
        <input
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="row">
          {/* TODO: Disable while editMutation.isPending; label it "Saving…" */}
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? "Saving…" : "Save"}
          </button>

          <button
            className="btn-ghost"
            onClick={() => {
              setTitle(thread.title);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>

        {editMutation.isError && (
          <p className="err">
            {editMutation.error?.message || "Failed to update thread."}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="card">
      <h3>{thread.title}</h3>
      <p>{thread.body}</p>

      <div className="row">
        <button className="btn-ghost" onClick={() => setEditing(true)}>
          Edit
        </button>

        {/* TODO: Disable while deleteMutation.isPending; label it "Deleting…" */}
        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting…" : "Delete"}
        </button>
      </div>

      {deleteMutation.isError && (
        <p className="err">
          {deleteMutation.error?.message || "Failed to delete thread."}
        </p>
      )}
    </li>
  );
}
