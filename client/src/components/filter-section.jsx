import { useState } from "react";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function FilterSection({
  fields,
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="shadow-xs">
      <CardContent>
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex items-center flex-col sm:flex-row gap-2">
            <h3 className="flex-1">Recherche & Filtres</h3>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </Button>
            {Object.values(filters).some(Boolean) && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      value={filters[field.name] || ""}
                      onChange={(e) =>
                        onFilterChange(field.name, e.target.value)
                      }
                      placeholder={`Filtrer par ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
