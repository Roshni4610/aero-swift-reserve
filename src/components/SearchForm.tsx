import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, PlaneTakeoff, PlaneLanding } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SearchForm = () => {
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState("round-trip");

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching flights...");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8">
      {/* Trip Type Selector */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={tripType === "round-trip" ? "default" : "outline"}
          onClick={() => setTripType("round-trip")}
          className="rounded-full"
        >
          Round Trip
        </Button>
        <Button
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
          className="rounded-full"
        >
          One Way
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* From */}
        <div className="space-y-2">
          <Label htmlFor="from" className="text-sm font-medium">From</Label>
          <div className="relative">
            <PlaneTakeoff className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="from"
              placeholder="City or Airport"
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label htmlFor="to" className="text-sm font-medium">To</Label>
          <div className="relative">
            <PlaneLanding className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="to"
              placeholder="City or Airport"
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Depart Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Depart</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !departDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Passengers */}
        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
          <Select defaultValue="1">
            <SelectTrigger id="passengers" className="h-12">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5+ Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label htmlFor="class" className="text-sm font-medium">Class</Label>
          <Select defaultValue="economy">
            <SelectTrigger id="class" className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium Economy</SelectItem>
              <SelectItem value="business">Business Class</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <Label className="text-sm font-medium opacity-0">Search</Label>
          <Button 
            onClick={handleSearch}
            className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            Search Flights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
