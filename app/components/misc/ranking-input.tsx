import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/lib/utils";
import { useI18n } from "~/hooks/use-i18n";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface RankingInputProps {
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  items: { key: string; label: string }[];
}

interface SortableItemProps {
  id: string;
  label: string;
  rank?: number;
  isCrossSectionDrag?: boolean;
}

function SortableItem({ id, label, rank, isCrossSectionDrag }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
    isOver,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  };

  // Only show drop indicator for cross-section drags (not reordering within same section)
  const showDropIndicator = isOver && isCrossSectionDrag;

  return (
    <div className="relative">
      {/* Drop indicator line with dots */}
      {showDropIndicator && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary z-50">
          <div className="absolute -left-1 -top-0.5 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute -right-1 -top-0.5 w-2 h-2 bg-primary rounded-full" />
        </div>
      )}
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 p-3 bg-background border border-border rounded cursor-move hover:border-muted-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-muted-foreground bg-muted rounded">
          {rank !== undefined ? rank : "•"}
        </div>
        <div className="flex-1 text-sm">{label}</div>
      </div>
    </div>
  );
}

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  highlightOnHover?: boolean;
}

function DroppableContainer({ id, children, className, highlightOnHover }: DroppableContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={cn(className, highlightOnHover && isOver && "ring-2 ring-primary")}>
      {children}
    </div>
  );
}

export function RankingInput({ value = [], onChange, items }: RankingInputProps) {
  const { t } = useI18n();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ensure value is always an array (handle null/undefined from form)
  const safeValue = value ?? [];

  // Map safeValue to items, preserving the order from safeValue
  const rankedItems = safeValue
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is { key: string; label: string } => item !== undefined);

  const unrankedItems = items.filter((item) => !safeValue.includes(item.key));

  // Mobile-friendly button handlers
  const handleAddToRanked = (key: string) => {
    onChange([...safeValue, key]);
  };

  const handleRemoveFromRanked = (key: string) => {
    onChange(safeValue.filter((id) => id !== key));
  };

  const handleMoveUp = (key: string) => {
    const index = safeValue.indexOf(key);
    if (index > 0) {
      const newValue = [...safeValue];
      [newValue[index - 1], newValue[index]] = [newValue[index], newValue[index - 1]];
      onChange(newValue);
    }
  };

  const handleMoveDown = (key: string) => {
    const index = safeValue.indexOf(key);
    if (index < safeValue.length - 1) {
      const newValue = [...safeValue];
      [newValue[index], newValue[index + 1]] = [newValue[index + 1], newValue[index]];
      onChange(newValue);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: { active: any; over: any }) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveInRanked = safeValue.includes(activeId);
    const isOverInRanked = safeValue.includes(overId) || overId === "ranked-container" || overId === "ranked-drop-zone";
    const isOverInUnranked = overId === "unranked-container";

    // Moving from unranked to ranked
    if (!isActiveInRanked && isOverInRanked) {
      if (overId === "ranked-container" || overId === "ranked-drop-zone") {
        // Drop on empty ranked container or bottom drop zone - add to end
        onChange([...safeValue, activeId]);
      } else {
        // Drop on specific ranked item
        const overIndex = safeValue.indexOf(overId);
        const newValue = [...safeValue];
        newValue.splice(overIndex, 0, activeId);
        onChange(newValue);
      }
    }
    // Moving from ranked to unranked
    else if (isActiveInRanked && (isOverInUnranked || !isOverInRanked)) {
      onChange(safeValue.filter((id) => id !== activeId));
    }
    // Reordering within ranked - drop on bottom zone to move to end
    else if (isActiveInRanked && overId === "ranked-drop-zone") {
      const oldIndex = safeValue.indexOf(activeId);
      const newValue = [...safeValue];
      newValue.splice(oldIndex, 1);
      newValue.push(activeId);
      onChange(newValue);
    }
    // Reordering within ranked - drop on specific item
    else if (isActiveInRanked && isOverInRanked && overId !== "ranked-container") {
      const oldIndex = safeValue.indexOf(activeId);
      const newIndex = safeValue.indexOf(overId);

      if (oldIndex !== newIndex) {
        const newValue = [...safeValue];
        newValue.splice(oldIndex, 1);
        newValue.splice(newIndex, 0, activeId);
        onChange(newValue);
      }
    }
  };

  const activeItem = activeId ? items.find((item) => item.key === activeId) : null;

  // Mobile view with buttons
  if (isMobile) {
    return (
      <div className="space-y-4">
        {unrankedItems.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-medium">
              {t("Items to Rank", "Éléments à classer")} ({unrankedItems.length})
            </div>
            <div className="space-y-2">
              {unrankedItems.map((item) => (
                <div key={item.key} className="flex items-center gap-3 p-3 bg-background border border-border rounded">
                  <div className="flex-1 text-sm">{item.label}</div>
                  <button
                    type="button"
                    onClick={() => handleAddToRanked(item.key)}
                    className="px-3 py-1 text-xs font-medium text-primary bg-primary/5 border border-primary/30 rounded hover:bg-primary/10"
                  >
                    {t("Add", "Ajouter")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {rankedItems.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-medium">
              {t("Ranked Items", "Éléments classés")} ({rankedItems.length})
            </div>
            <div className="space-y-2">
              {rankedItems.map((item, index) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/30 rounded"
                >
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-primary rounded">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-sm">{item.label}</div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(item.key)}
                      disabled={index === 0}
                      className="p-1 text-primary hover:bg-primary/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(item.key)}
                      disabled={index === rankedItems.length - 1}
                      className="p-1 text-primary hover:bg-primary/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromRanked(item.key)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rankedItems.length === 0 && unrankedItems.length === 0 && (
          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground border border-border rounded">
            {t("No items to rank", "Aucun élément à classer")}
          </div>
        )}
      </div>
    );
  }

  // Desktop view with drag & drop
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-3 text-sm font-medium">
            {t("Items to Rank", "Éléments à classer")} ({unrankedItems.length})
          </div>
          <SortableContext items={unrankedItems.map((item) => item.key)} strategy={verticalListSortingStrategy}>
            <DroppableContainer
              id="unranked-container"
              className="space-y-2 min-h-[100px] p-3 bg-muted border border-border rounded"
            >
              {unrankedItems.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                  {t("All items ranked", "Tous les éléments classés")}
                </div>
              ) : (
                unrankedItems.map((item) => (
                  <SortableItem
                    key={item.key}
                    id={item.key}
                    label={item.label}
                    isCrossSectionDrag={activeId !== null && safeValue.includes(activeId)}
                  />
                ))
              )}
            </DroppableContainer>
          </SortableContext>
        </div>

        <div>
          <div className="mb-3 text-sm font-medium">
            {t("Ranked Items", "Éléments classés")} ({rankedItems.length})
          </div>
          <SortableContext items={safeValue} strategy={verticalListSortingStrategy}>
            <DroppableContainer
              id="ranked-container"
              className="space-y-2 min-h-[200px] p-3 bg-muted border border-border rounded"
              highlightOnHover={rankedItems.length === 0}
            >
              {rankedItems.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                  {t("Drag items here to rank", "Faites glisser les éléments ici pour les classer")}
                </div>
              ) : (
                <>
                  {rankedItems.map((item, index) => (
                    <SortableItem
                      key={item.key}
                      id={item.key}
                      label={item.label}
                      rank={index + 1}
                      isCrossSectionDrag={activeId !== null && !safeValue.includes(activeId)}
                    />
                  ))}
                  <DroppableContainer
                    id="ranked-drop-zone"
                    className={cn(
                      "h-12 border-2 border-dashed border-transparent rounded transition-colors",
                      overId === "ranked-drop-zone" && "border-primary bg-primary/10"
                    )}
                  >
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                      {overId === "ranked-drop-zone"
                        ? t("Drop here to add to end", "Déposez ici pour ajouter à la fin")
                        : ""}
                    </div>
                  </DroppableContainer>
                </>
              )}
            </DroppableContainer>
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="flex items-center gap-3 p-3 bg-background border-2 border-primary rounded shadow-lg opacity-70">
            <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-muted-foreground bg-muted rounded">
              •
            </div>
            <div className="flex-1 text-sm">{activeItem.label}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
