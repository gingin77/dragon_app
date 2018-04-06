class CreateDragons < ActiveRecord::Migration[5.1]
  def change
    create_table :dragons do |t|
        t.string :name 
      t.timestamps
    end
  end
end
