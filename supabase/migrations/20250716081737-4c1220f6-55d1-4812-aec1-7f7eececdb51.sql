-- Add RLS policy to allow public INSERT on invoices table for manual payments
CREATE POLICY "Allow manual invoice creation" 
ON public.invoices 
FOR INSERT 
WITH CHECK (true);