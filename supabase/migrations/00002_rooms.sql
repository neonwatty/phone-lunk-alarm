-- Kiosk rooms
CREATE TABLE public.rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily detection counts per room
CREATE TABLE public.daily_counts (
  room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (room_id, date)
);

-- RLS for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_counts ENABLE ROW LEVEL SECURITY;

-- Anyone can read rooms (needed for join page and badge)
CREATE POLICY "Rooms are publicly readable"
  ON public.rooms FOR SELECT USING (true);

-- Authenticated users can create rooms
CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can delete their rooms
CREATE POLICY "Owners can delete their rooms"
  ON public.rooms FOR DELETE
  USING (auth.uid() = owner_id);

-- Anyone can read daily counts (needed for badge)
CREATE POLICY "Daily counts are publicly readable"
  ON public.daily_counts FOR SELECT USING (true);

-- Anyone can upsert daily counts (members increment via anon key)
CREATE POLICY "Anyone can insert daily counts"
  ON public.daily_counts FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update daily counts"
  ON public.daily_counts FOR UPDATE USING (true);

-- Atomic increment function
CREATE OR REPLACE FUNCTION public.increment_daily_count(p_room_id TEXT, p_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.daily_counts (room_id, date, count)
  VALUES (p_room_id, p_date, 1)
  ON CONFLICT (room_id, date)
  DO UPDATE SET count = public.daily_counts.count + 1;
END;
$$;
