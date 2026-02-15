import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock, Mail, Phone, User, MessageSquare, Users } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  guests: z.string().min(1, "Please select number of guests"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  message: z.string().optional(),
  // Honeypot field - should always be empty
  website: z.string().max(0).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  lang: Language;
}

export default function BookingForm({ lang }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formLoadTime] = useState(Date.now());
  const { toast } = useToast();
  const t = translations[lang];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });
  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    // Valentine's Day 2026 - special hours only
    if (selectedDate === "2026-02-14") {
      return ["21:00"];
    }

    const dayOfWeek = new Date(`${selectedDate}T12:00:00`).getDay();

    // Tuesday (2) to Thursday (4)
    if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      return ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
    }

    // Friday (5), Saturday (6), Sunday (0)
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
      return ["17:00", "17:30", "19:00", "19:30", "20:30", "21:00", "21:30"];
    }

    // Monday closed
    return [];
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedTime) return;
    if (!selectedDate || availableTimes.length === 0 || !availableTimes.includes(selectedTime)) {
      setValue("time", "");
    }
  }, [availableTimes, selectedDate, selectedTime, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    // Anti-spam validation
    // 1. Check honeypot field (should be empty)
    if (data.website && data.website.length > 0) {
      console.log("Spam detected: honeypot field filled");
      setIsSubmitting(false);
      return; // Silent fail for bots
    }

    // 2. Time-based validation (form must be open for at least 3 seconds)
    const timeOnForm = Date.now() - formLoadTime;
    if (timeOnForm < 3000) {
      toast({
        title: "Error",
        description: lang === 'de' ? 'Bitte nehmen Sie sich Zeit, das Formular auszufüllen.' :
                     lang === 'ru' ? 'Пожалуйста, не торопитесь при заполнении формы.' :
                     lang === 'uz' ? 'Iltimos, formani to‘ldirishda shoshilmang.' :
                     'Please take your time filling out the form.',
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "1febc7c6-870f-49de-84f8-0551f65741b0", // Replace with your actual key
          name: data.name,
          email: data.email,
          phone: data.phone,
          guests: data.guests,
          date: data.date,
          time: data.time,
          message: data.message || "",
          subject: `Table Booking Request from ${data.name} for ${data.guests} guests`,
          botcheck: data.website || "", // Web3Forms honeypot field
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: t.contact.form.success,
          variant: "default",
          duration: Infinity,
        });
        reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: t.contact.form.error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4" />
          {t.contact.form.name}
        </Label>
        <Input
          id="name"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-destructive text-sm text-red-700 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4" />
          {t.contact.form.email}
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-destructive text-sm text-red-700 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4" />
          {t.contact.form.phone}
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && (
          <p className="text-destructive text-sm text-red-700 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Number of Guests */}
      <div>
        <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          {t.contact.form.guests}
        </Label>
        <select
          id="guests"
          {...register("guests")}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.guests ? "border-destructive" : ""}`}
        >
          <option value="">{lang === 'de' ? 'Bitte wählen' : lang === 'ru' ? 'Пожалуйста, выберите' : lang === 'uz' ? 'Iltimos, tanlang' : 'Please select'}</option>
          <option value="1">1 {lang === 'de' ? 'Person' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'person'}</option>
          <option value="2">2 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человека' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="3">3 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человека' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="4">4 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человека' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="5">5 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="6">6 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="7">7 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="8">8 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="9">9 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="10">10 {lang === 'de' ? 'Personen' : lang === 'ru' ? 'человек' : lang === 'uz' ? 'kishi' : 'people'}</option>
          <option value="10+">{lang === 'de' ? 'Mehr als 10 Personen' : lang === 'ru' ? 'Более 10 человек' : lang === 'uz' ? '10 kishidan ortiq' : 'More than 10 people'}</option>
        </select>
        {errors.guests && (
          <p className="text-destructive text-sm text-red-700 mt-1">{errors.guests.message}</p>
        )}
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <Label htmlFor="date" className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4" />
            {t.contact.form.date}
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && (
            <p className="text-destructive text-sm text-red-700 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <Label htmlFor="time" className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            {t.contact.form.time}
          </Label>
          <select
            id="time"
            {...register("time")}
            disabled={!selectedDate || availableTimes.length === 0}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.time ? "border-destructive" : ""}`}
          >
            <option value="">
              {lang === "de"
                ? !selectedDate
                  ? "Bitte zuerst Datum wählen"
                  : availableTimes.length === 0
                  ? "Keine verfügbaren Zeiten"
                  : "Bitte wählen"
                : lang === "ru"
                ? !selectedDate
                  ? "Сначала выберите дату"
                  : availableTimes.length === 0
                  ? "Нет доступного времени"
                  : "Пожалуйста, выберите"
                : lang === "uz"
                ? !selectedDate
                  ? "Avval sanani tanlang"
                  : availableTimes.length === 0
                  ? "Mos vaqt mavjud emas"
                  : "Iltimos, tanlang"
                : !selectedDate
                ? "Please select a date first"
                : availableTimes.length === 0
                ? "No available times"
                : "Please select"}
            </option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="text-destructive text-sm text-red-700 mt-1">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4" />
          {t.contact.form.message}
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder={
            lang === "de"
              ? "Besondere Wünsche..."
              : lang === "ru"
              ? "Особые пожелания..."
              : lang === "uz"
              ? "Maxsus so‘rovlar..."
              : "Special requests..."
          }
          rows={4}
        />
      </div>

      {/* Honeypot field - Hidden from users, but visible to bots */}
      <input
        type="text"
        {...register("website")}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg"
      >
        {isSubmitting ? "..." : t.contact.form.submit}
      </Button>
    </form>
  );
}
