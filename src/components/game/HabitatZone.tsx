
import { useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HabitatZoneProps {
  id: string;
  name: string;
  image: string;
}

export function HabitatZone({ id, name, image }: HabitatZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "p-4 text-center habitat-zone",
        isOver && "can-drop"
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
