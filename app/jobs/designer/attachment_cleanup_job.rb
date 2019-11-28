module Designer
  class AttachmentCleanupJob < ActiveJob::Base
    def perform(resource)
      resource.attachments.each do |a| #.eager_load(:blob)
        next unless a.metadata[:designer_element_id] #a.metadata[:designer_page_id] ||
        # p a.metadata
        puts '-------------------------------------'
        # puts a.metadata[:designer_page_id]
        # puts a.metadata[:designer_element_id]
        # puts resource.find_page a.metadata[:designer_page_id]
        # puts resource.find_element a.metadata[:designer_element_id]

        element = resource.find_element(a.metadata[:designer_element_id])
        puts "--- Attachment `#{a.key}` belongs to: #{element}"
        unless element
          # a.metadata[:designer_page_id] && !resource.find_page(a.metadata[:designer_page_id]) ||
          puts "--- Deleting attachment `#{a.key}`"

          # Purge or detach the attachment depending on if the blob is used elsewhere
          if ActiveStorage::Attachment.where.not(id: a.id).joins(:blob)
                                      .where(active_storage_blobs: {id: a.blob_id}).exists?
            a.detach
          else
            a.purge
          end
        end
      end
    end
  end
end
