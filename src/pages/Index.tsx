
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { DraggableAnimal } from "@/components/game/DraggableAnimal";
import { HabitatZone } from "@/components/game/HabitatZone";
import { useSound } from "@/hooks/use-sound";
import { Trophy, Lightbulb } from "lucide-react";

const animals = [
  { id: "penguin", name: "Penguin", habitat: "arctic", image: "https://plus.unsplash.com/premium_photo-1661816797370-928a8749043c?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "I love the cold and snow!" },
  { id: "camel", name: "Camel", habitat: "desert", image: "https://images.unsplash.com/photo-1553983658-0d7afeb5c53f?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "I can survive with very little water!" },
  { id: "monkey", name: "Monkey", habitat: "jungle", image: "https://plus.unsplash.com/premium_photo-1664299631876-f143dc691c4d?q=80&w=1297&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "I love swinging from tree to tree!" },
  { id: "deer", name: "Deer", habitat: "forest", image: "https://plus.unsplash.com/premium_photo-1661819541230-034d07819c9b?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "I live among tall trees and green plants!" },
  { id: "polar-bear", name: "Polar Bear", habitat: "arctic", image: "https://plus.unsplash.com/premium_photo-1723040527350-3baeab1954bf?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "My white fur helps me blend with the ice!" },
];

const habitats = [
  { id: "arctic", name: "Arctic", image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "desert", name: "Desert", image: "https://images.unsplash.com/photo-1511860810434-a92f84c6f01e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "jungle", name: "Jungle", image: "https://plus.unsplash.com/premium_photo-1687428554393-abae29906c75?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "forest", name: "Forest", image: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

type IncorrectAttempts = {
  [key: string]: number;
};

export default function Index() {
  const [matches, setMatches] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<IncorrectAttempts>({});
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));
  
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    const newProgress = (matches.length / animals.length) * 100;
    setProgress(newProgress);
    
    if (newProgress === 100) {
      toast.success("Congratulations! You've matched all animals to their habitats!", {
        duration: 5000,
      });
      // Trigger celebratory animation by adding a class to body
      document.body.classList.add("celebration");
      // Remove class after animation
      setTimeout(() => {
        document.body.classList.remove("celebration");
      }, 3000);
    }
  }, [matches]);

  const showHint = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (animal) {
      toast.info(
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400 animate-bounce-subtle" />
          <span>Hint: {animal.hint}</span>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const animalId = active.id as string;
    const habitatId = over.id as string;
    const animal = animals.find(a => a.id === animalId);

    if (animal?.habitat === habitatId) {
      playSuccess();
      setMatches(prev => [...prev, animalId]);
      toast.success(`Great job! ${animal.name} loves the ${habitatId}!`, {
        className: "animate-scale-in",
      });
      // Reset incorrect attempts for this animal
      setIncorrectAttempts(prev => ({
        ...prev,
        [animalId]: 0
      }));
    } else {
      playError();
      // Increment incorrect attempts
      const newAttempts = {
        ...incorrectAttempts,
        [animalId]: (incorrectAttempts[animalId] || 0) + 1
      };
      setIncorrectAttempts(newAttempts);
      
      // Show hint after 3 incorrect attempts
      if (newAttempts[animalId] === 3) {
        showHint(animalId);
      }
      
      toast.error("Try again! That's not the right habitat.", {
        className: "animate-shake",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Animal Habitat Explorer</h1>
          <p className="text-muted-foreground">
            Help the animals find their perfect homes!
          </p>
        </header>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Progress value={progress} className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }} 
              />
            </Progress>
            {progress === 100 && (
              <Trophy className="text-secondary animate-bounce-subtle" />
            )}
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary">Animals</h2>
                <div className="grid grid-cols-2 gap-4">
                  {animals.filter(animal => !matches.includes(animal.id)).map((animal) => (
                    <DraggableAnimal
                      key={animal.id}
                      id={animal.id}
                      name={animal.name}
                      image={animal.image}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary">Habitats</h2>
                <div className="grid grid-cols-2 gap-4">
                  {habitats.map((habitat) => (
                    <HabitatZone
                      key={habitat.id}
                      id={habitat.id}
                      name={habitat.name}
                      image={habitat.image}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DndContext>
        </Card>
      </div>
    </div>
  );
}
