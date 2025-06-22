import { Suspense } from "react";
import CreateTask from "./CreateTask";

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTask />
    </Suspense>
  );
}
