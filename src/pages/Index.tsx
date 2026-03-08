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

export default function Index() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("Все");
  const [activeType, setActiveType] = useState("Все типы");
  const [selectedContract, setSelectedContract] = useState<typeof MOCK_CONTRACTS[0] | null>(null);

  const filtered = MOCK_CONTRACTS.filter((c) => {
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
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
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
                onClick={() => setSelectedContract(contract)}
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

      {/* Detail Panel */}
      {selectedContract && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedContract(null)}
        >
          <div
            className="glass rounded-2xl w-full max-w-lg p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-1">{selectedContract.id}</p>
                <h2 className="font-bold text-lg leading-tight">{selectedContract.title}</h2>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {[
                { label: "Контрагент", value: selectedContract.counterparty, icon: "Building2" },
                { label: "Тип договора", value: selectedContract.type, icon: "Tag" },
                { label: "Срок действия", value: `${selectedContract.startDate} — ${selectedContract.endDate}`, icon: "Calendar" },
                { label: "Сумма договора", value: selectedContract.amount, icon: "DollarSign" },
                { label: "Статус", value: STATUS_LABELS[selectedContract.status], icon: "Activity" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3">
                  <Icon name={row.icon} size={15} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{row.label}</span>
                  <span className="text-sm font-medium flex-1">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="Paperclip" size={12} />
                Файлы договора
              </p>
              {selectedContract.files > 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: selectedContract.files }, (_, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-2.5 group hover:bg-muted/50 transition-colors cursor-pointer">
                      <Icon name="FileText" size={14} className="text-primary" />
                      <span className="text-sm flex-1">Документ_{idx + 1}.pdf</span>
                      <Icon name="Download" size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <Icon name="Upload" size={20} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Перетащите файлы или нажмите для загрузки</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, Word, изображения</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Icon name="Pencil" size={14} />
                Редактировать
              </button>
              <button className="glass px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Icon name="Upload" size={14} />
                Загрузить файл
              </button>
              <button className="glass px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}