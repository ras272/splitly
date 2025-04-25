-- Crear un bucket para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatares', true);

-- Política para permitir a los usuarios autenticados leer cualquier avatar
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Política para permitir a los usuarios autenticados subir sus propios avatares
CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

-- Política para permitir a los usuarios actualizar sus propios avatares
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = owner
  );
