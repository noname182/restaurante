import { useState } from "react";
import CategoryRow from "./CategoryRow";
import ChildrenModal from "./ChildrenModal";

export default function CategoryList({
  categories,
  selectionMode,
  selectedIds,
  setSelectedIds,
  onEdit,
  level = 0,
  refresh
}) {
  const [modalCategory, setModalCategory] = useState(null);

  const toggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} style={{ paddingLeft: `${level * 20}px` }}>
            <CategoryRow
              category={cat}
              isSelectable={selectionMode}
              selected={selectedIds.includes(cat.id)}
              onSelect={toggle}
              onEdit={onEdit}
              onOpenChildrenModal={setModalCategory}
            />

          </div>
        ))}
      </div>

      {/* Modal */}
      {modalCategory && (
        <ChildrenModal
          category={modalCategory}
          onClose={() => setModalCategory(null)}
          onEdit={onEdit}
          refresh={refresh}
        />
      )}
    </>
  );
}
