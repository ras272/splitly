-- Crear la tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Crear la tabla de grupos
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.users NOT NULL,
  members UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Crear la tabla de transacciones
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'settlement', 'loan')),
  paid_by UUID REFERENCES public.users NOT NULL,
  paid_to UUID REFERENCES public.users,
  split_between UUID[] NOT NULL,
  group_id UUID REFERENCES public.groups NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para manejar nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Configurar políticas de seguridad (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para grupos
CREATE POLICY "Users can view groups they are members of"
  ON public.groups FOR SELECT
  USING (auth.uid() = ANY(members));

CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update groups they created"
  ON public.groups FOR UPDATE
  USING (auth.uid() = created_by);

-- Políticas para transacciones
CREATE POLICY "Users can view transactions in their groups"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = transactions.group_id
      AND auth.uid() = ANY(groups.members)
    )
  );

CREATE POLICY "Users can create transactions in their groups"
  ON public.transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = transactions.group_id
      AND auth.uid() = ANY(groups.members)
    )
  );

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (
    auth.uid() = paid_by AND
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = transactions.group_id
      AND auth.uid() = ANY(groups.members)
    )
  );
