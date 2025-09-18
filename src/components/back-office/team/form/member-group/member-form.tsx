// shadcn/ui version
"use client";

import { useMemo, useState } from "react";

// shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, Info, Plus, Search, X, Zap } from "lucide-react";

// ---------------- Data types ----------------
type Member = {
  id: number;
  name: string;
  connectors: "all" | string[]; // 'all' means all connectors; otherwise list
};

// ---------------- Mock members ----------------
const MOCK_MEMBERS: Member[] = Array.from({ length: 50 }).map((_, i) => {
  const id = 27360 + i;
  const base: Member = {
    id,
    name: [
      "Soravit Kreankawo",
      "Korrawit Srichan",
      "Thitinan PungKang",
      "Paris Pratan",
      "Namo Trussaprom",
      "Supatipunno Pakawata",
      "Korn P.",
      "Nattanan R.",
      "Chanakan T.",
      "Thanawat P.",
    ][i % 10],
    connectors: i % 3 === 0 ? "all" : ["Left 3B", "Right 4B", "2 mores"],
  };
  return base;
});

function InitialsAvatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    const parts = name.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [name]);
  return (
    <Avatar className="h-9 w-9">
      <AvatarImage src="" alt={name} />
      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// ---------------- Right Panel ----------------
export function MemberGroupRightPanel() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [openConnectorFor, setOpenConnectorFor] = useState<number | null>(null);
  const [memberConnectors, setMemberConnectors] = useState<
    Record<number, string[]>
  >({});

  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_MEMBERS;
    return MOCK_MEMBERS.filter(
      (m) => m.name.toLowerCase().includes(q) || String(m.id).includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const members = filtered.slice(start, start + pageSize);

  const allCheckedOnPage = members.every((m) => selectedIds.includes(m.id));

  const toggleAll = () => {
    if (allCheckedOnPage) {
      setSelectedIds((prev) =>
        prev.filter((id) => !members.some((m) => m.id === id)),
      );
    } else {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...members.map((m) => m.id)])),
      );
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <Card className="h-full w-full bg-background shadow-none">
      <CardHeader>
        {/* Top title + search */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-title text-xl font-semibold">รายการ</div>
          <div className="relative max-w-4xl">
            <Input
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              placeholder="Search Name , ID"
              className="h-10 w-full rounded-md bg-input pl-9"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {/* Subheader: select-all + right column header */}
          <div className="mt-3 flex items-center justify-between border-t p-3 pt-3">
            <Label className="inline-flex items-center">
              <Checkbox
                checked={allCheckedOnPage}
                onCheckedChange={toggleAll}
              />
              <span className="p-2 text-sm text-muted-foreground">
                เลือกทั้งหมด : {selectedIds.length} รายการ
              </span>
            </Label>
            <div className="text-sm font-normal text-muted-foreground">
              Connector Access
            </div>
          </div>
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 px-3 py-4 hover:bg-muted/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Checkbox
                  checked={selectedIds.includes(m.id)}
                  onCheckedChange={() => toggleOne(m.id)}
                />
                <InitialsAvatar name={m.name} />
                <div className="min-w-0">
                  <div className="text-title truncate text-sm font-medium">
                    {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {m.id}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {memberConnectors[m.id] && memberConnectors[m.id].length > 0 ? (
                  <div className="flex max-w-[460px] flex-wrap items-center justify-end gap-2">
                    {memberConnectors[m.id].slice(0, 3).map((id) => {
                      const c = MOCK_CONNECTORS.find((x) => x.id === id);
                      const label = c ? c.label : id;
                      return (
                        <Badge
                          key={id}
                          variant="outline"
                          className="inline-flex max-w-[160px] items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary"
                        >
                          <span className="truncate">{label}</span>
                          <Button
                            type="button"
                            onClick={() =>
                              setMemberConnectors((prev) => ({
                                ...prev,
                                [m.id]: (prev[m.id] || []).filter(
                                  (x) => x !== id,
                                ),
                              }))
                            }
                            variant={"destructive"}
                            size={"icon"}
                            className="ml-1 grid h-4 w-4 place-items-center"
                            aria-label="Remove connector"
                            title="Remove"
                          >
                            <X className="size-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                    {memberConnectors[m.id].length > 3 && (
                      <Badge variant="secondary" className="rounded-full">
                        +{memberConnectors[m.id].length - 3}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs font-normal"
                      onClick={() => setOpenConnectorFor(m.id)}
                    >
                      Select
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Showing {start + 1} to {Math.min(start + pageSize, filtered.length)}{" "}
          of {filtered.length} Results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </Button>
          {Array.from({ length: totalPages })
            .slice(0, 6)
            .map((_, i) => {
              const idx = i + 1;
              const active = page === idx;
              return (
                <Button
                  key={idx}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  className={`h-7 w-7 p-0 ${active ? "bg-primary/20 text-primary hover:text-primary-foreground" : ""}`}
                  onClick={() => setPage(idx)}
                >
                  {idx}
                </Button>
              );
            })}
          {totalPages > 6 && <span className="px-1">…</span>}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </Button>
        </div>
      </CardFooter>
      <ConnectorDialog
        open={openConnectorFor !== null}
        onOpenChange={(v) => !v && setOpenConnectorFor(null)}
        selected={
          openConnectorFor ? (memberConnectors[openConnectorFor] ?? []) : []
        }
        onSubmit={(next) => {
          if (openConnectorFor !== null) {
            setMemberConnectors((prev) => ({
              ...prev,
              [openConnectorFor]: next,
            }));
          }
          setOpenConnectorFor(null);
        }}
      />
    </Card>
  );
}

// ---------------- Station Dialog (shadcn) ----------------
const MOCK_STATIONS = [
  "EV Station พระราม 5",
  "Ev One",
  "Roger Station EV",
  "Ev OneOr",
  "สถานี การไฟฟ้านครหลวง กรุงเทพมหานคร",
  "Central Rama 2",
  "The Mall NGV",
  "BTS Bang Wa",
];

type StationDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: string[];
  onChange: (next: string[]) => void;
};

function StationChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <Badge
      variant="default"
      className="inline-flex max-w-full items-center gap-1 bg-primary py-2 text-primary-foreground"
    >
      <span className="truncate pr-2">{label}</span>
      {onRemove && (
        <Button
          type="button"
          variant={"destructive"}
          size={"icon"}
          onClick={onRemove}
          className="-mr-1 grid size-5 place-items-center rounded-full bg-destructive"
        >
          <X className="size-3" />
        </Button>
      )}
    </Badge>
  );
}

// ---------------- Connector Dialog (shadcn) ----------------
const MOCK_CONNECTORS = [
  { id: "L3B_TW", label: "Left 3B", charger: "Tailwin Charger" },
  { id: "L1B_AC", label: "Left 1B", charger: "ACDC Charger" },
  { id: "R1A_KU", label: "Right 1A", charger: "Ku AC22" },
  { id: "L3B_SD", label: "Left 3B", charger: "SuDC1234" },
];

type ConnectorDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: string[]; // array of connector ids
  onSubmit: (next: string[]) => void;
};

function ConnectorDialog({
  open,
  onOpenChange,
  selected,
  onSubmit,
}: ConnectorDialogProps) {
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<string[]>(selected);
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s
      ? MOCK_CONNECTORS
      : MOCK_CONNECTORS.filter(
          (c) =>
            c.label.toLowerCase().includes(s) ||
            c.charger.toLowerCase().includes(s),
        );
  }, [q]);

  const toggle = (id: string) => {
    setPick((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setShowDropdown(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-w-4xl">
        <DialogHeader className="pb-8">
          <DialogTitle className="text-title">Select Connector</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Label className="mb-2 block">
              Search & Select <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex w-full">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search Station"
                className="h-11 rounded-r-none bg-muted shadow-none"
              />
              <Button
                type="button"
                variant="default"
                className="h-11 rounded-l-none"
              >
                <Search className="size-4" />
              </Button>
            </div>

            {/* Dropdown List */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-md border bg-card shadow-lg">
                {filtered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Not Found a Connector
                  </div>
                ) : (
                  filtered.map((c) => {
                    const active = pick.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(c.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted ${active ? "bg-card" : ""}`}
                      >
                        <Checkbox
                          checked={active}
                          className="dark:data-[state=checked]:bg-success data-[state=checked]:bg-success data-[state=checked]:border-success dark:data-[state=checked]:border-success pointer-events-none"
                        />
                        <span className="grid size-9 place-items-center rounded-full border bg-background">
                          <Zap className="size-4 text-primary" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-title truncate text-sm font-medium">
                            {c.label} , {c.charger}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Selected chips */}
          <div>
            <div className="mb-3 text-sm text-muted-foreground">
              {pick.length} Connector
            </div>
            <div className="flex flex-wrap gap-3 rounded-lg border-2 border-dashed p-2 py-4">
              {pick.length === 0 ? (
                <div className="flex w-full items-center justify-center py-4 text-sm text-muted-foreground">
                  Haven&apos;t selected a connector yet.
                </div>
              ) : (
                pick.map((id) => {
                  const c = MOCK_CONNECTORS.find((x) => x.id === id)!;
                  return (
                    <Badge
                      key={id}
                      variant="default"
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-primary-foreground"
                    >
                      <span className="truncate pr-1">{c.label}</span>
                      <Button
                        type="button"
                        variant={"destructive"}
                        size={"icon"}
                        onClick={() => toggle(id)}
                        className="grid size-4 items-center rounded-full"
                      >
                        <X className="size-3" />
                      </Button>
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-construction-soft text-construction items-center rounded-md px-3 py-4 text-sm">
            <Info className="mr-2 inline-block size-4" />
            เลือกเครื่องชาร์จได้มากกว่า 1 เพื่อกำหนดราคาการใช้งาน
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 sm:gap-4">
          <DialogClose asChild>
            <Button variant="secondary" className="min-w-[160px]">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="min-w-[200px]" onClick={() => onSubmit(pick)}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StationDialog({
  open,
  onOpenChange,
  selected,
  onChange,
}: StationDialogProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s
      ? MOCK_STATIONS
      : MOCK_STATIONS.filter((x) => x.toLowerCase().includes(s));
  }, [q]);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((x) => x !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title text-2xl font-bold">
            Select Station
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <Label className="mb-2 block">
              Search & Select <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex w-full">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Station"
                className="h-11 rounded-r-none"
              />
              <Button
                type="button"
                variant="default"
                className="h-11 rounded-l-none"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </div>

          {/* Selected chips */}
          <div>
            <div className="mb-3 text-sm text-muted-foreground">
              {selected.length} Stations
            </div>
            <div className="flex flex-wrap gap-3">
              {selected.map((s) => (
                <StationChip
                  key={s}
                  label={s}
                  onRemove={() => onChange(selected.filter((x) => x !== s))}
                />
              ))}
            </div>
          </div>

          <div className="border-t" />

          {/* List */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filtered.map((name) => {
              const active = selected.includes(name);
              return (
                <Button
                  key={name}
                  type="button"
                  variant={active ? "secondary" : "outline"}
                  className="justify-between"
                  onClick={() => toggle(name)}
                >
                  <span className="truncate pr-2 text-left">{name}</span>
                  <span
                    className={`grid size-5 place-items-center rounded-full text-sm ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {" "}
                    {active ? (
                      <Check className="size-3" />
                    ) : (
                      <Plus className="size-3" />
                    )}{" "}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="border-t" />

          {/* Alert note */}
          <div className="rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-700">
            เลือกสถานีได้มากกว่า 1 สถานีเพื่อกำหนดราคาการใช้งาน
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 sm:gap-4">
          <DialogClose asChild>
            <Button variant="secondary" className="min-w-[160px]">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="min-w-[200px]">Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Left Panel ----------------
function MemberGroupLeftForm() {
  const [groupName, setGroupName] = useState("");
  const [details, setDetails] = useState("");
  const [userType, setUserType] = useState("Internal");
  const [status, setStatus] = useState("Publish");
  const [walletAllowed, setWalletAllowed] = useState(true);
  const [scope, setScope] = useState<"any" | "team">("any");

  const [selectedStations, setSelectedStations] = useState<string[]>([
    "EV Station พระราม 5",
    "Ev One",
    "Roger",
  ]);
  const [openStation, setOpenStation] = useState(false);

  return (
    <Card className="max-w-2xl bg-background shadow-none">
      <CardContent className="space-y-8 pt-6">
        <div>
          <Label className="mb-1 block">
            Group Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="โปรดระบุ"
            className="bg-muted"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label>
              Details{" "}
              <span className="align-middle text-xs text-muted-foreground">
                (Optional)
              </span>
            </Label>
          </div>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            placeholder="โปรดระบุ"
            className="bg-muted"
          />
        </div>

        <div>
          <Label className="mb-1 block">
            Charging Station <span className="text-destructive">*</span>
          </Label>
          <div className="mb-2">
            <Badge
              variant="secondary"
              className="bg-construction-soft text-construction border font-normal"
            >
              <Info />
              เลือกสถานีมากกว่า 1 สถานีเพื่อกำหนดราคาการใช้งาน
            </Badge>
          </div>
          <Dialog open={openStation} onOpenChange={setOpenStation}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full border bg-muted/60 px-3 py-2 hover:bg-muted/80"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {selectedStations.length === 0 ? (
                      <span className="text-sm font-normal text-muted-foreground">
                        เลือกสถานี
                      </span>
                    ) : (
                      <>
                        {selectedStations.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="default"
                            className="inline-flex shrink-0 items-center gap-1 bg-primary px-2.5 py-0.5 text-xs text-primary-foreground"
                          >
                            <span className="max-w-[80px] truncate">{s}</span>
                            <Button
                              type="button"
                              variant={"destructive"}
                              size={"icon"}
                              className="grid size-3 place-items-center rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedStations((prev) =>
                                  prev.filter((station) => station !== s),
                                );
                              }}
                            >
                              <X className="size-2" />
                            </Button>
                          </Badge>
                        ))}
                        {selectedStations.length > 1 && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            +{selectedStations.length - 1} สถานี
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
                </div>
              </Button>
            </DialogTrigger>
            <StationDialog
              open={openStation}
              onOpenChange={setOpenStation}
              selected={selectedStations}
              onChange={setSelectedStations}
            />
          </Dialog>
        </div>

        <div>
          <Label className="mb-1 block">
            User type <span className="text-destructive">*</span>
          </Label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="External">External</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">Member pricing</Label>
          <Select>
            <SelectTrigger className="w-full bg-muted text-muted-foreground">
              <SelectValue placeholder="Apply member pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none"> pricing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Publish">Publish</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member permissions */}
        <div className="pt-2">
          <div className="mb-3 border-b border-t pb-3 pt-3">
            <div className="text-md font-semibold">Member permissions</div>
            <div className="text-xs text-muted-foreground">
              (you can change permissions any time)
            </div>
          </div>

          <div className="flex items-stretch justify-between pb-2">
            <div className="mb-4 text-sm">
              Can pay charging fees with Team wallet
            </div>
            <Switch
              checked={walletAllowed}
              onCheckedChange={setWalletAllowed}
              className="data-[state=checked]:bg-success bg-muted"
            />
          </div>

          <RadioGroup
            value={scope}
            onValueChange={(v: "any" | "team") => setScope(v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="any"
                id="scope-any"
                disabled={!walletAllowed}
              />
              <Label
                htmlFor="scope-any"
                className={`text-xs ${
                  !walletAllowed
                    ? "text-xs text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                On any chargers in OneCharge
              </Label>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <RadioGroupItem
                value="team"
                id="scope-team"
                disabled={!walletAllowed}
              />
              <Label
                htmlFor="scope-team"
                className={`leading-5 ${!walletAllowed ? "text-muted-foreground" : ""}`}
              >
                <span className="block text-xs text-muted-foreground">
                  On chargers within this team
                </span>
                <span className="block text-xs text-muted-foreground">
                  (includes Parent team, Nested Team)
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------- Layout Wrapper (default export) ----------------
export default function MemberGroupForm() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(320px,360px)_1fr]">
      <MemberGroupLeftForm />
      <MemberGroupRightPanel />
    </div>
  );
}
