
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DraggableAnimalProps {
  id: string;
  name: string;
  image: string;
}

export function DraggableAnimal({ id, name, image }: DraggableAnimalProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 text-center draggable animate-bounce-subtle",
        isDragging && "opacity-50"
      )}
    >
      <div className="aspect-square rounded-lg overflow-hidden mb-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="font-medium">{name}</p>
    </Card>
  );
}
