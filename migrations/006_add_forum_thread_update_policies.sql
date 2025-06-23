-- Add missing UPDATE and DELETE policies for forum_threads table

-- Allow users to update their own threads
CREATE POLICY "Users can update their own threads." ON forum_threads 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Allow users to delete their own threads
CREATE POLICY "Users can delete their own threads." ON forum_threads 
FOR DELETE 
USING (auth.uid() = author_id);
