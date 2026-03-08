import { useState } from "react";
import Icon from "@/components/ui/icon";

const MOCK_CONTRACTS = [
  {
    id: "ДГ-2024-001",
    title: "Поставка офисного оборудования",
    counterparty: "ООО «ТехноСнаб»",
    type: "Поставка",
    status: "active",
    startDate: "01.03.2024",
    endDate: "01.03.2025",
    amount: "1 250 000 ₽",
    files: 3,
  },
  {
    id: "ДГ-2024-002",
    title: "Аренда офисных помещений",
    counterparty: "АО «Бизнес-Центр Плаза»",
    type: "Аренда",
    status: "active",
    startDate: "01.01.2024",
    endDate: "31.12.2024",
    amount: "4 800 000 ₽",
    files: 5,
  },
  {
    id: "ДГ-2023-089",
    title: "Разработка корпоративного сайта",
    counterparty: "ИП Кириллов А.В.",
    type: "Услуги",
    status: "expired",
    startDate: "15.06.2023",
    endDate: "15.12.2023",
    amount: "320 000 ₽",
    files: 7,
  },
  {
    id: "ДГ-2024-003",
    title: "Техническое обслуживание серверов",
    counterparty: "ООО «ИТ-Сервис»",
    type: "Обслуживание",
    status: "pending",
    startDate: "01.04.2024",
    endDate: "01.04.2025",
    amount: "960 000 ₽",
    files: 2,
  },
  {
    id: "ДГ-2024-004",
    title: "Страхование имущества",
    counterparty: "СПАО «Ингосстрах»",
    type: "Страхование",
    status: "active",
    startDate: "01.02.2024",
    endDate: "01.02.2025",
    amount: "185 000 ₽",
    files: 4,
  },
  {
    id: "ДГ-2024-005",
    title: "Юридическое сопровождение",
    counterparty: "Адвокатское бюро «Право и Защита»",
    type: "Услуги",
    status: "draft",
    startDate: "—",
    endDate: "—",
    amount: "540 000 ₽",
    files: 0,
  },
];

const STATUS_LABELS: Record<string, string> = {
  active: "Активный",
  expired: "Истёк",
  pending: "На согласовании",
  draft: "Черновик",
};

const STATUS_DOTS: Record<string, string> = {
  active: "bg-green-500",
  expired: "bg-red-500",
  pending: "bg-yellow-400",
  draft: "bg-gray-500",
};

const TYPE_ICONS: Record<string, string> = {
  Поставка: "Package",
  Аренда: "Building2",
  Услуги: "Briefcase",
  Обслуживание: "Wrench",
  Страхование: "Shield",
};

const STATS = [
  { label: "Всего договоров", value: "6", icon: "FileText", delta: "+2 за месяц" },
  { label: "Активных", value: "3", icon: "CheckCircle2", delta: "50% от общего числа" },
  { label: "Истекают в 30 дней", value: "1", icon: "Clock", delta: "Требует внимания" },
  { label: "Общая сумма", value: "8,05 млн ₽", icon: "TrendingUp", delta: "За 2024 год" },
];

const ALL_STATUSES = ["Все", "Активный", "Истёк", "На согласовании", "Черновик"];
const ALL_TYPES = ["Все типы", "Поставка", "Аренда", "Услуги", "Обслуживание", "Страхование"];
const CONTRACT_TYPES = ["Поставка", "Аренда", "Услуги", "Обслуживание", "Страхование"];
const CONTRACT_STATUSES = [
  { value: "active", label: "Активный" },
  { value: "pending", label: "На согласовании" },
  { value: "draft", label: "Черновик" },
];

const EMPTY_FORM = {
  title: "",
  counterparty: "",
  type: "Услуги",
  status: "draft",
  startDate: "",
  endDate: "",
  amount: "",
};

export default function Index() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("Все");
  const [activeType, setActiveType] = useState("Все типы");
  const [selectedContract, setSelectedContract] = useState<typeof MOCK_CONTRACTS[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<typeof MOCK_CONTRACTS[0] | null>(null);

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openDetail = (contract: typeof MOCK_CONTRACTS[0]) => {
    setSelectedContract(contract);
    setEditMode(false);
    setEditForm({ ...contract });
  };

  const closeDetail = () => {
    setSelectedContract(null);
    setEditMode(false);
    setEditForm(null);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = () => {
    if (!editForm) return;
    setContracts((prev) => prev.map((c) => c.id === editForm.id ? editForm : c));
    setSelectedContract(editForm);
    setEditMode(false);
  };

  const handleDelete = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
    closeDetail();
  };

  const handleSubmit = () => {
    if (!form.title || !form.counterparty) return;
    const newContract = {
      id: `ДГ-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, "0")}`,
      title: form.title,
      counterparty: form.counterparty,
      type: form.type,
      status: form.status,
      startDate: form.startDate || "—",
      endDate: form.endDate || "—",
      amount: form.amount ? `${form.amount} ₽` : "—",
      files: 0,
    };
    setContracts((prev) => [newContract, ...prev]);
    setForm(EMPTY_FORM);
    setShowNewModal(false);
  };

  const filtered = contracts.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      activeStatus === "Все" || STATUS_LABELS[c.status] === activeStatus;
    const matchType = activeType === "Все типы" || c.type === activeType;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="min-h-screen font-golos">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-blue">
            <Icon name="FileStack" size={16} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">КонтрактБаза</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Icon name="Bell" size={15} />
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-mono">1</span>
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Icon name="Plus" size={15} />
            Новый договор
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-5 animate-slide-up contract-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider leading-tight">{stat.label}</p>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={stat.icon} size={15} className="text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{stat.delta}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="glass rounded-xl p-5 mb-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию, контрагенту или номеру..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1 mr-1">
                <Icon name="Filter" size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Статус:</span>
              </div>
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`filter-chip px-3 py-1 rounded-full text-xs border border-border text-muted-foreground ${activeStatus === s ? "active" : ""}`}
                >
                  {s}
                </button>
              ))}
              <div className="w-px h-4 bg-border mx-1" />
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`filter-chip px-3 py-1 rounded-full text-xs border border-border text-muted-foreground ${activeType === t ? "active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm text-muted-foreground">
            Найдено: <span className="text-foreground font-medium">{filtered.length}</span> договоров
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="ArrowUpDown" size={12} />
            По дате обновления
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center animate-fade-in">
              <Icon name="SearchX" size={36} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Договоры не найдены</p>
              <button
                onClick={() => { setSearch(""); setActiveStatus("Все"); setActiveType("Все типы"); }}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            filtered.map((contract, i) => (
              <div
                key={contract.id}
                onClick={() => openDetail(contract)}
                className="glass rounded-xl p-5 contract-card cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={TYPE_ICONS[contract.type] || "FileText"} size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{contract.id}</span>
                        <span className={`status-${contract.status} text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[contract.status]} ${contract.status === "active" ? "pulse-dot" : ""}`} />
                          {STATUS_LABELS[contract.status]}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{contract.type}</span>
                      </div>
                      <h3 className="font-semibold text-sm truncate">{contract.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1 truncate">{contract.counterparty}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground mb-1">Период</p>
                      <p className="text-xs font-medium">{contract.startDate}</p>
                      <p className="text-xs text-muted-foreground">— {contract.endDate}</p>
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="text-xs text-muted-foreground mb-1">Сумма</p>
                      <p className="text-sm font-bold text-primary">{contract.amount}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {contract.files > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Paperclip" size={12} />
                          {contract.files}
                        </div>
                      )}
                      <button className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Icon name="MoreHorizontal" size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* New Contract Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="bg-card rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="FilePlus" size={16} className="text-primary" />
                </div>
                <h2 className="font-bold text-base">Новый договор</h2>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Название */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Название договора <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Например: Поставка офисной мебели"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
                />
              </div>

              {/* Контрагент */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Контрагент <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Название организации или ИП"
                  value={form.counterparty}
                  onChange={(e) => handleFormChange("counterparty", e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
                />
              </div>

              {/* Тип и Статус */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип договора</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                  >
                    {CONTRACT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Статус</label>
                  <select
                    value={form.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                  >
                    {CONTRACT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Даты */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата начала</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleFormChange("startDate", e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата окончания</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleFormChange("endDate", e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                  />
                </div>
              </div>

              {/* Сумма */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Сумма договора, ₽</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-border flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!form.title || !form.counterparty}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon name="Check" size={15} />
                Создать договор
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedContract && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
          onClick={closeDetail}
        >
          <div
            className="bg-card rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in border border-border flex flex-col"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${editMode ? "bg-amber-100" : "bg-primary/10"}`}>
                  <Icon name={editMode ? "Pencil" : "FileText"} size={15} className={editMode ? "text-amber-600" : "text-primary"} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">{selectedContract.id}</p>
                  <h2 className="font-bold text-sm leading-tight truncate">
                    {editMode ? "Редактирование договора" : selectedContract.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="h-8 px-3 rounded-lg hover:bg-muted flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  >
                    <Icon name="Pencil" size={13} />
                    Изменить
                  </button>
                )}
                <button
                  onClick={closeDetail}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3 overflow-y-auto flex-1">
              {editMode ? (
                <>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Название договора</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Контрагент</label>
                    <input
                      type="text"
                      value={editForm.counterparty}
                      onChange={(e) => handleEditChange("counterparty", e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип договора</label>
                      <select
                        value={editForm.type}
                        onChange={(e) => handleEditChange("type", e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                      >
                        {CONTRACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Статус</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => handleEditChange("status", e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                      >
                        {CONTRACT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата начала</label>
                      <input
                        type="text"
                        placeholder="дд.мм.гггг"
                        value={editForm.startDate === "—" ? "" : editForm.startDate}
                        onChange={(e) => handleEditChange("startDate", e.target.value || "—")}
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Дата окончания</label>
                      <input
                        type="text"
                        placeholder="дд.мм.гггг"
                        value={editForm.endDate === "—" ? "" : editForm.endDate}
                        onChange={(e) => handleEditChange("endDate", e.target.value || "—")}
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Сумма договора</label>
                    <input
                      type="text"
                      value={editForm.amount}
                      onChange={(e) => handleEditChange("amount", e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </>
              ) : (
                <>
                  {[
                    { label: "Контрагент", value: selectedContract.counterparty, icon: "Building2" },
                    { label: "Тип договора", value: selectedContract.type, icon: "Tag" },
                    { label: "Период", value: `${selectedContract.startDate} — ${selectedContract.endDate}`, icon: "Calendar" },
                    { label: "Сумма", value: selectedContract.amount, icon: "DollarSign" },
                    { label: "Статус", value: STATUS_LABELS[selectedContract.status], icon: "Activity" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3">
                      <Icon name={row.icon} size={15} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{row.label}</span>
                      <span className="text-sm font-medium flex-1">{row.value}</span>
                    </div>
                  ))}

                  {/* Files */}
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Icon name="Paperclip" size={12} />
                      Файлы договора
                    </p>
                    {selectedContract.files > 0 ? (
                      <div className="space-y-1.5">
                        {Array.from({ length: selectedContract.files }, (_, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-2.5 group hover:bg-muted/50 transition-colors cursor-pointer">
                            <Icon name="FileText" size={14} className="text-primary" />
                            <span className="text-sm flex-1">Документ_{idx + 1}.pdf</span>
                            <Icon name="Download" size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-border rounded-lg p-5 text-center">
                        <Icon name="Upload" size={18} className="text-muted-foreground mx-auto mb-1.5" />
                        <p className="text-xs text-muted-foreground">Файлы не прикреплены</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-border flex gap-2 flex-shrink-0">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={!editForm.title || !editForm.counterparty}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Icon name="Check" size={14} />
                    Сохранить изменения
                  </button>
                  <button
                    onClick={() => { setEditMode(false); setEditForm({ ...selectedContract }); }}
                    className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Pencil" size={14} />
                    Редактировать
                  </button>
                  <button className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors flex items-center gap-2">
                    <Icon name="Upload" size={14} />
                    Загрузить файл
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContract.id)}
                    className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}