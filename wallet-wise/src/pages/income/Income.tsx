import React, { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, ArrowUpRight } from "lucide-react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import IncomeForm from "../../components/forms/IncomeForm";
import ReusableTable from "../../components/tables/ReusableTable";
import type { Column } from "../../components/tables/ReusableTable";
import incomeService from "../../services/incomeService";
import type { Transaction } from "../../services/mockDb";
import { useToast } from "../../hooks/useToast";
import { useDebounce } from "../../hooks/useDebounce";

export const Income: React.FC = () => {
  const { addToast } = useToast();
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Transaction | null>(null);
  const [deletingIncome, setDeletingIncome] = useState<Transaction | null>(null);

  const fetchIncomes = async () => {
    try {
      const data = await incomeService.getIncomes();
      setIncomes(data);
    } catch (err: any) {
      addToast("Failed to fetch incomes list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleAddOrEditSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome.id, formData);
        addToast("Income entry updated successfully.", "success");
      } else {
        await incomeService.addIncome(formData);
        addToast("New income source logged successfully.", "success");
      }
      setIsFormOpen(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (err: any) {
      addToast(err.message || "Failed to save income record.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingIncome) return;
    setIsLoading(true);
    try {
      await incomeService.deleteIncome(deletingIncome.id);
      addToast("Income entry deleted successfully.", "success");
      setDeletingIncome(null);
      fetchIncomes();
    } catch (err: any) {
      addToast("Failed to delete record.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Search computation
  const filteredIncomes = React.useMemo(() => {
    return incomes.filter((inc) => {
      const matchSearch =
        inc.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (inc.description || "").toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || inc.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [incomes, debouncedSearch, selectedCategory]);

  const categories = ["All", "Salary", "Freelance", "Investments", "Gifts", "Refunds", "Other"];

  // Table Columns Definition
  const columns: Column<Transaction>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (val) => <span className="font-semibold text-foreground/90">{val}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-500">₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border">
          {val}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1.5 select-none">
          <button
            onClick={() => {
              setEditingIncome(row);
              setIsFormOpen(true);
            }}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingIncome(row)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 pt-20 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Income Manager</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and track your primary and passive incoming cash flow</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingIncome(null);
            setIsFormOpen(true);
          }}
          className="h-10 text-xs px-4"
        >
          <PlusCircle className="mr-2 h-4.5 w-4.5" />
          Record Income
        </Button>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-11 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-semibold text-muted-foreground hidden sm:inline select-none">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-11 w-full sm:w-[180px] rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Empty state block */}
      {filteredIncomes.length === 0 ? (
        <EmptyState
          title={search || selectedCategory !== "All" ? "No matches found" : "No transactions found"}
          description={
            search || selectedCategory !== "All"
              ? "Try adjusting your search queries or category filters."
              : "Click the button above to log your first income receipt."
          }
          icon={<ArrowUpRight className="h-7 w-7 text-emerald-500" />}
          actionText={search || selectedCategory !== "All" ? undefined : "Record Income"}
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <ReusableTable columns={columns} data={filteredIncomes} pageSize={10} />
      )}

      {/* Income Modal (Create/Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIncome(null);
        }}
        title={editingIncome ? "Edit Income Entry" : "Record New Income"}
      >
        <IncomeForm
          initialData={editingIncome}
          onSubmit={handleAddOrEditSubmit}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingIncome}
        onClose={() => setDeletingIncome(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete income record{" "}
            <span className="font-semibold text-foreground">"{deletingIncome?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2 select-none">
            <Button variant="outline" size="sm" onClick={() => setDeletingIncome(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm} isLoading={isLoading}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Income;
